import { RequestHandler } from "express";
import { ChatRequest, ChatResponse } from "@shared/api";

export const handleChat: RequestHandler = async (req, res) => {
  try {
    const { message } = req.body as ChatRequest;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        message: "Please enter a message"
      });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return res.status(500).json({
        message: "Groq API key not configured"
      });
    }

    console.log("🤖 Chatbot: Calling Groq API...");

    // System prompt for inventory management assistant
    const systemPrompt = `You are an expert inventory management assistant. Help users with:
- Inventory optimization and stock level recommendations
- Demand forecasting and sales predictions
- Profit analysis and pricing strategies
- Supply chain management
- Product performance analysis
- Risk assessment for inventory

Always provide actionable, specific recommendations based on the user's questions about inventory and business operations.
Keep responses concise, professional, and focused on inventory management.`;

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
          temperature: 0.7,
          max_tokens: 512,
        }),
      }
    );

    console.log("📡 Groq Chatbot Response Status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Groq API Error:", errorData);
      return res.status(response.status).json({
        message: "Failed to get response from AI. Please try again."
      });
    }

    const data = await response.json();
    console.log("📦 Groq Chatbot Response:", data);

    if (!data.choices || data.choices.length === 0) {
      console.error("❌ No choices in response:", data);
      return res.status(400).json({
        message: "No response from AI. Please try again."
      });
    }

    const choice = data.choices[0];
    if (!choice.message || !choice.message.content) {
      console.error("❌ No message content in choice:", choice);
      return res.status(400).json({
        message: "Invalid response format from AI."
      });
    }

    let aiResponse = choice.message.content.trim();
    console.log("✅ Groq Chatbot Response:", aiResponse);

    const chatResponse: ChatResponse = {
      message: aiResponse
    };

    res.status(200).json(chatResponse);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      message: "Failed to process your request. Please try again."
    });
  }
};