import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { query, initializeDatabase } from "./db";
import { analyzeInventoryWithAI, generateProfitAnalysis, generateInventoryRecommendations } from "./gemini";
import { hashPassword, authenticateUser, requireRole } from "./auth";

export async function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize database on startup
  try {
    await initializeDatabase();
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
  }

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({ message: ping, status: "ok" });
  });

  app.get("/api/demo", handleDemo);

  // ============================================
  // AUTHENTICATION ENDPOINTS
  // ============================================

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name, role } = req.body;

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const result = await query(
        "INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, role, name",
        [email, hashedPassword, name, role || "manager"]
      );

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to register user"
      });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password, role } = req.body;
      const auth = await authenticateUser(email, password, role);

      if (!auth) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials or insufficient permissions"
        });
      }

      res.json({
        success: true,
        data: {
          user: auth.user,
          token: auth.token
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Login failed"
      });
    }
  });

  // ============================================
  // CHATBOT ENDPOINT (Requires Manager or Admin role)
  // ============================================

  // Chatbot endpoint
  // Public chat endpoint (for home page)
  app.post("/api/chat/public", async (req, res) => {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false,
        message: "Message is required" 
      });
    }

    try {
      const GROQ_API_KEY = process.env.GROQ_API_KEY;

      if (!GROQ_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "Groq API key not configured"
        });
      }

      console.log("🤖 Public Chatbot: Calling Groq API...");

      const systemPrompt = `You are an expert inventory management assistant. Keep responses SHORT and CONCISE.

Answer in 2-3 sentences maximum. Use bullet points if needed.
Focus on: Inventory optimization, demand forecasting, profit analysis, pricing strategies.

Be direct, specific, and actionable. No long explanations.`;

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: message,
              },
            ],
            temperature: 0.5,
            max_tokens: 200,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Groq API Error:", errorData);
        return res.status(response.status).json({
          success: false,
          message: "Failed to get response from AI. Please try again."
        });
      }

      const data = await response.json();

      if (!data.choices || data.choices.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No response from AI. Please try again."
        });
      }

      const choice = data.choices[0];
      if (!choice.message || !choice.message.content) {
        return res.status(400).json({
          success: false,
          message: "Invalid response format from AI."
        });
      }

      let aiResponse = choice.message.content.trim();
      console.log("✅ Public Chatbot Response:", aiResponse);

      res.json({ 
        success: true,
        message: aiResponse 
      });
    } catch (error) {
      console.error("Public chat error:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to process your request. Please try again." 
      });
    }
  });

  // Protected chat endpoint (for authenticated users)
  app.post("/api/chat", requireRole(["manager", "admin"]), async (req, res) => {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false,
        message: "Message is required" 
      });
    }

    try {
      const GROQ_API_KEY = process.env.GROQ_API_KEY;

      if (!GROQ_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "Groq API key not configured"
        });
      }

      console.log("🤖 Chatbot: Calling Groq API...");

      // System prompt for inventory management assistant
      const systemPrompt = `You are an expert inventory management assistant. Keep responses SHORT and CONCISE.

Answer in 2-3 sentences maximum. Use bullet points if needed.
Focus on: Inventory optimization, demand forecasting, profit analysis, pricing strategies.

Be direct, specific, and actionable. No long explanations.`;

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: message,
              },
            ],
            temperature: 0.5,
            max_tokens: 200,
          }),
        }
      );

      console.log("📡 Groq Chatbot Response Status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Groq API Error:", errorData);
        return res.status(response.status).json({
          success: false,
          message: "Failed to get response from AI. Please try again."
        });
      }

      const data = await response.json();
      console.log("📦 Groq Chatbot Response:", data);

      if (!data.choices || data.choices.length === 0) {
        console.error("❌ No choices in response:", data);
        return res.status(400).json({
          success: false,
          message: "No response from AI. Please try again."
        });
      }

      const choice = data.choices[0];
      if (!choice.message || !choice.message.content) {
        console.error("❌ No message content in choice:", choice);
        return res.status(400).json({
          success: false,
          message: "Invalid response format from AI."
        });
      }

      let aiResponse = choice.message.content.trim();
      console.log("✅ Groq Chatbot Response:", aiResponse);

      res.json({ 
        success: true,
        message: aiResponse 
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to process your request. Please try again." 
      });
    }
  });

  // ============================================
  // PRODUCTS ENDPOINTS (Requires Manager or Admin role)
  // ============================================

  // Get all products
  app.get("/api/products", requireRole(["manager", "admin"]), async (_req, res) => {
    try {
      const result = await query("SELECT * FROM products ORDER BY created_at DESC");
      res.json({ 
        success: true, 
        data: result.rows, 
        count: result.rowCount 
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch products" 
      });
    }
  });

  // Handle product search
  app.get("/api/products/search", async (req, res) => {
    try {
      const { searchQuery } = req.query;
      const result = await query(
        "SELECT * FROM products WHERE name ILIKE $1 OR sku ILIKE $1 ORDER BY name",
        [`%${searchQuery}%`]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error("Product search error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to search products" 
      });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const result = await query("SELECT * FROM products WHERE id = $1", [req.params.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Create product
  app.post("/api/products", async (req, res) => {
    try {
      const { sku, name, category, unit_price, cost_price, reorder_level, min_order_qty } = req.body;
      const result = await query(
        "INSERT INTO products (sku, name, category, unit_price, cost_price, reorder_level, min_order_qty) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [sku, name, category, unit_price, cost_price, reorder_level, min_order_qty]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Update product
  app.put("/api/products/:id", async (req, res) => {
    try {
      const { sku, name, category, unit_price, cost_price, reorder_level, min_order_qty } = req.body;
      const result = await query(
        "UPDATE products SET sku = $1, name = $2, category = $3, unit_price = $4, cost_price = $5, reorder_level = $6, min_order_qty = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *",
        [sku, name, category, unit_price, cost_price, reorder_level, min_order_qty, req.params.id]
      );
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Delete product
  app.delete("/api/products/:id", async (req, res) => {
    try {
      await query("DELETE FROM products WHERE id = $1", [req.params.id]);
      res.json({ success: true, message: "Product deleted" });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // ============================================
  // INVENTORY ENDPOINTS
  // ============================================

  // Get inventory
  app.get("/api/inventory", async (_req, res) => {
    try {
      const result = await query(`
        SELECT i.*, p.sku, p.name, p.category, p.reorder_level 
        FROM inventory i 
        JOIN products p ON i.product_id = p.id 
        ORDER BY p.name
      `);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Update inventory
  app.post("/api/inventory/update", async (req, res) => {
    try {
      const { product_id, on_hand, reserved } = req.body;
      const available = on_hand - reserved;
      const result = await query(
        "INSERT INTO inventory (product_id, on_hand, reserved, available) VALUES ($1, $2, $3, $4) ON CONFLICT (product_id) DO UPDATE SET on_hand = $2, reserved = $3, available = $4, last_updated = CURRENT_TIMESTAMP RETURNING *",
        [product_id, on_hand, reserved, available]
      );
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // ============================================
  // SALES ENDPOINTS
  // ============================================

  // Record a sale
  app.post("/api/sales", async (req, res) => {
    try {
      const { product_id, quantity, sale_price, cost_price, created_by } = req.body;
      const profit = (sale_price - cost_price) * quantity;
      const profit_margin = ((sale_price - cost_price) / sale_price) * 100;

      const result = await query(
        "INSERT INTO sales_transactions (product_id, quantity, sale_price, cost_price, profit, profit_margin, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [product_id, quantity, sale_price, cost_price, profit, profit_margin, created_by]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Get sales for profit analysis
  app.get("/api/sales", async (req, res) => {
    try {
      const days = req.query.days || 30;
      const result = await query(
        `SELECT st.*, p.name as product_name, p.sku 
        FROM sales_transactions st 
        JOIN products p ON st.product_id = p.id 
        WHERE st.transaction_date >= NOW() - INTERVAL '1 day' * $1 
        ORDER BY st.transaction_date DESC`,
        [days]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // ============================================
  // SUPPLIERS ENDPOINTS
  // ============================================

  // Get suppliers
  app.get("/api/suppliers", async (_req, res) => {
    try {
      const result = await query("SELECT * FROM suppliers ORDER BY name");
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Create supplier
  app.post("/api/suppliers", async (req, res) => {
    try {
      const { name, contact_person, email, phone, default_lead_time, min_order_qty } = req.body;
      const result = await query(
        "INSERT INTO suppliers (name, contact_person, email, phone, default_lead_time, min_order_qty) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [name, contact_person, email, phone, default_lead_time, min_order_qty]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Update supplier
  app.put("/api/suppliers/:id", async (req, res) => {
    try {
      const { name, contact_person, email, phone, default_lead_time, min_order_qty } = req.body;
      const result = await query(
        "UPDATE suppliers SET name = $1, contact_person = $2, email = $3, phone = $4, default_lead_time = $5, min_order_qty = $6 WHERE id = $7 RETURNING *",
        [name, contact_person, email, phone, default_lead_time, min_order_qty, req.params.id]
      );
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Delete supplier
  app.delete("/api/suppliers/:id", async (req, res) => {
    try {
      await query("DELETE FROM suppliers WHERE id = $1", [req.params.id]);
      res.json({ success: true, message: "Supplier deleted" });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // ============================================
  // PURCHASE ORDERS ENDPOINTS
  // ============================================

  // Create purchase order
  app.post("/api/purchase-orders", async (req, res) => {
    try {
      const { product_id, supplier_id, quantity, unit_price, expected_delivery_date, created_by } = req.body;
      const total_amount = quantity * unit_price;
      const result = await query(
        "INSERT INTO purchase_orders (product_id, supplier_id, quantity, unit_price, total_amount, expected_delivery_date, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [product_id, supplier_id, quantity, unit_price, total_amount, expected_delivery_date, created_by]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Get purchase orders
  app.get("/api/purchase-orders", async (_req, res) => {
    try {
      const result = await query(
        "SELECT po.*, p.name, p.sku, s.name as supplier_name FROM purchase_orders po JOIN products p ON po.product_id = p.id JOIN suppliers s ON po.supplier_id = s.id ORDER BY po.created_at DESC"
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Update purchase order status
  app.put("/api/purchase-orders/:id", async (req, res) => {
    try {
      const { status } = req.body;
      const result = await query("UPDATE purchase_orders SET status = $1 WHERE id = $2 RETURNING *", [
        status,
        req.params.id,
      ]);
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Delete purchase order
  app.delete("/api/purchase-orders/:id", async (req, res) => {
    try {
      await query("DELETE FROM purchase_orders WHERE id = $1", [req.params.id]);
      res.json({ success: true, message: "PO deleted" });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });



  // Get profit analysis
  app.get("/api/analysis/profit", async (_req, res) => {
    try {
      const salesResult = await query("SELECT st.*, p.name, p.sku FROM sales_transactions st JOIN products p ON st.product_id = p.id ORDER BY st.transaction_date DESC LIMIT 100");
      const analysis = await generateProfitAnalysis(salesResult.rows);
      res.json({ success: true, analysis });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Get inventory recommendations
  app.get("/api/analysis/inventory", async (_req, res) => {
    try {
      const invResult = await query("SELECT i.*, p.name, p.sku, p.reorder_level FROM inventory i JOIN products p ON i.product_id = p.id");
      const recommendations = await generateInventoryRecommendations(invResult.rows);
      res.json({ success: true, recommendations });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // ============================================
  // GROK AI INSIGHTS ENDPOINT
  // ============================================

  // Diagnostic endpoint to test Grok API
  app.get("/api/insights/test-grok", async (_req, res) => {
    try {
      const GROQ_API_KEY = process.env.GROQ_API_KEY;

      if (!GROQ_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "Groq API key not configured"
        });
      }

      console.log("🧪 Testing Groq API...");

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "user",
                content: "Hello, are you working? Reply with just 'Yes' or 'No'.",
              },
            ],
            temperature: 0.3,
            max_tokens: 100,
          }),
        }
      );

      const data = await response.json();
      
      console.log("🧪 Groq test response status:", response.status);
      console.log("🧪 Groq test response:", data);

      res.json({
        status: response.status,
        ok: response.ok,
        data: data,
        keyMasked: GROQ_API_KEY.substring(0, 10) + "..."
      });
    } catch (error) {
      console.error("🧪 Test error:", error);
      res.status(500).json({
        error: String(error)
      });
    }
  });

  app.post("/api/insights/generate", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ 
          success: false, 
          message: "Prompt is required" 
        });
      }

      const GROQ_API_KEY = process.env.GROQ_API_KEY;

      if (!GROQ_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "Groq API key not configured. Please set GROQ_API_KEY environment variable.",
          isAIGenerated: false
        });
      }

      console.log("🤖 Server: Calling Groq API with key:", GROQ_API_KEY.substring(0, 10) + "...");

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.3,
            max_tokens: 1024,
          }),
        }
      );

      console.log("📡 Groq API Response Status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Groq API Error:", errorData);
        console.error("❌ Groq API Key used (masked):", GROQ_API_KEY.substring(0, 20) + "...");
        console.error("❌ Full error response:", JSON.stringify(errorData, null, 2));
        return res.status(response.status).json({
          success: false,
          message: `Groq API Error: ${response.status} - ${errorData.error?.message || errorData.message || "Unknown error"}`,
          error: errorData,
          isAIGenerated: false
        });
      }

      const data = await response.json();
      console.log("📦 Groq Response:", data);

      if (!data.choices || data.choices.length === 0) {
        console.error("❌ No choices in response:", data);
        return res.status(400).json({
          success: false,
          message: "No choices in API response",
          isAIGenerated: false
        });
      }

      const choice = data.choices[0];
      if (!choice.message || !choice.message.content) {
        console.error("❌ No message content in choice:", choice);
        return res.status(400).json({
          success: false,
          message: "No message content in response",
          isAIGenerated: false
        });
      }

      let aiResponse = choice.message.content.trim();
      console.log("✅ Raw Groq Response:", aiResponse);

      // Remove markdown code blocks if present
      if (aiResponse.includes("```json")) {
        aiResponse = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      }
      if (aiResponse.includes("```")) {
        aiResponse = aiResponse.replace(/```\n?/g, "");
      }

      // Parse JSON
      let parsedInsights;
      try {
        parsedInsights = JSON.parse(aiResponse);
        console.log("✅ Successfully parsed Groq insights");
      } catch (parseError) {
        console.error("❌ Failed to parse response:", aiResponse);
        return res.status(400).json({
          success: false,
          message: "Failed to parse insights response",
          raw: aiResponse,
          isAIGenerated: false
        });
      }

      res.json({
        success: true,
        data: parsedInsights,
        isAIGenerated: true,
        source: "groq"
      });
    } catch (error) {
      console.error("⚠️ Groq Error, trying Gemini fallback:", error);
      
      // Fallback to Gemini if Groq fails
      try {
        const { prompt } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        
        if (!GEMINI_API_KEY) {
          throw new Error("Gemini API key not configured");
        }

        console.log("🤖 Fallback: Calling Gemini API...");
        
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: req.body.prompt,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 1024,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("❌ Gemini API Error:", errorData);
          throw new Error("Gemini API also failed");
        }

        const data = await response.json();
        console.log("✅ Gemini Response received");

        let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        
        // Remove markdown code blocks if present
        if (aiResponse.includes("```json")) {
          aiResponse = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "");
        }
        if (aiResponse.includes("```")) {
          aiResponse = aiResponse.replace(/```\n?/g, "");
        }

        let parsedInsights;
        try {
          parsedInsights = JSON.parse(aiResponse);
          console.log("✅ Successfully parsed Gemini insights");
        } catch (parseError) {
          console.error("❌ Failed to parse Gemini response");
          throw new Error("Failed to parse Gemini response");
        }

        return res.json({
          success: true,
          data: parsedInsights,
          isAIGenerated: true,
          source: "gemini"
        });
      } catch (geminiError) {
        console.error("⚠️ Both Groq and Gemini failed:", geminiError);
        res.status(500).json({
          success: false,
          message: "Server error generating insights",
          error: String(error),
          isAIGenerated: false
        });
      }
    }
  });

  // ============================================
  // USERS ENDPOINTS
  // ============================================

  // Get all users
  app.get("/api/users", async (_req, res) => {
    try {
      const result = await query("SELECT id, email, role, name, created_at FROM users ORDER BY created_at DESC");
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Get single user
  app.get("/api/users/:id", async (req, res) => {
    try {
      const result = await query("SELECT id, email, role, name, created_at FROM users WHERE id = $1", [req.params.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Create user
  app.post("/api/users", async (req, res) => {
    try {
      const { email, password, role, name } = req.body;
      
      // Hash password before storing
      const hashedPassword = await hashPassword(password);
      
      const result = await query(
        "INSERT INTO users (email, password, role, name) VALUES ($1, $2, $3, $4) RETURNING id, email, role, name, created_at",
        [email, hashedPassword, role || "manager", name]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Update user
  app.put("/api/users/:id", async (req, res) => {
    try {
      const { email, role, name } = req.body;
      const result = await query(
        "UPDATE users SET email = $1, role = $2, name = $3 WHERE id = $4 RETURNING id, email, role, name, created_at",
        [email, role, name, req.params.id]
      );
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Delete user
  app.delete("/api/users/:id", async (req, res) => {
    try {
      await query("DELETE FROM users WHERE id = $1", [req.params.id]);
      res.json({ success: true, message: "User deleted" });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // ============================================
  // AI MODELS ENDPOINTS
  // ============================================

  // Get all AI models
  app.get("/api/ai-models", async (_req, res) => {
    try {
      const result = await query("SELECT * FROM ai_models ORDER BY created_at DESC");
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Get single AI model
  app.get("/api/ai-models/:id", async (req, res) => {
    try {
      const result = await query("SELECT * FROM ai_models WHERE id = $1", [req.params.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: "AI Model not found" });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Create AI model
  app.post("/api/ai-models", async (req, res) => {
    try {
      const { name, model_type, status, accuracy, data_points } = req.body;
      const result = await query(
        "INSERT INTO ai_models (name, model_type, status, accuracy, data_points, last_trained_date) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *",
        [name, model_type || "demand_forecast", status || "Active", accuracy || 0, data_points || 0]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Update AI model
  app.put("/api/ai-models/:id", async (req, res) => {
    try {
      const { name, model_type, status, accuracy, data_points } = req.body;
      const result = await query(
        "UPDATE ai_models SET name = $1, model_type = $2, status = $3, accuracy = $4, data_points = $5, last_trained_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *",
        [name, model_type, status, accuracy, data_points, req.params.id]
      );
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Delete AI model
  app.delete("/api/ai-models/:id", async (req, res) => {
    try {
      await query("DELETE FROM ai_models WHERE id = $1", [req.params.id]);
      res.json({ success: true, message: "AI Model deleted" });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // ============================================
  // PLANTS ENDPOINTS
  // ============================================

  // Get plants
  app.get("/api/plants", async (_req, res) => {
    try {
      const result = await query("SELECT * FROM plants ORDER BY name");
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Create plant
  app.post("/api/plants", async (req, res) => {
    try {
      const { name, location, capacity, status } = req.body;
      const result = await query(
        "INSERT INTO plants (name, location, capacity, status) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, location, capacity, status || "Operational"]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Update plant
  app.put("/api/plants/:id", async (req, res) => {
    try {
      const { name, location, capacity, status } = req.body;
      const result = await query(
        "UPDATE plants SET name = $1, location = $2, capacity = $3, status = $4 WHERE id = $5 RETURNING *",
        [name, location, capacity, status, req.params.id]
      );
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Delete plant
  app.delete("/api/plants/:id", async (req, res) => {
    try {
      await query("DELETE FROM plants WHERE id = $1", [req.params.id]);
      res.json({ success: true, message: "Plant deleted" });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // ============================================
  // PREDICT API HEALTH CHECK ENDPOINT
  // ============================================
  const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

  app.get("/api/predict/health", async (_req, res) => {
    try {
      const response = await fetch(`${PYTHON_API_URL}/health`);
      const data = await response.json();
      res.json({ success: true, python_api: data });
    } catch (error) {
      res.status(503).json({
        success: false,
        message: "Python API is not available",
        error: String(error)
      });
    }
  });

  return app;
}
