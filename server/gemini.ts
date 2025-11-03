import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeInventoryWithAI(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const enhancedPrompt = `You are an expert inventory management consultant for small shops and warehouses. 
    
Context: You help shopkeepers understand their inventory, profits, and business insights.

User Query: ${prompt}

Provide practical, actionable advice based on real inventory management principles. Keep responses concise and clear.`;

    const result = await model.generateContent(enhancedPrompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to get AI response");
  }
}

export async function generateProfitAnalysis(query: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const enhancedPrompt = `You are an expert financial analyst for retail businesses.
    
Context: Analyze profit trends, revenue patterns, and provide financial insights.

User Query: ${query}

Provide clear financial analysis and actionable recommendations based on business metrics.`;

    const result = await model.generateContent(enhancedPrompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to get profit analysis");
  }
}

export async function generateInventoryRecommendations(query: string, inventoryData?: any[]): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = "";
    
    if (inventoryData) {
      // If inventory data is provided, analyze it
      const lowStockItems = inventoryData.filter((item) => item.on_hand < item.reorder_level);
      const overstockedItems = inventoryData.filter((item) => item.on_hand > item.reorder_level * 3);

      prompt = `As an inventory management expert, analyze this inventory data:

Low Stock Items (${lowStockItems.length}):
${lowStockItems
  .map((item) => `- ${item.name} (SKU: ${item.sku}): ${item.on_hand} units (reorder level: ${item.reorder_level})`)
  .join("\n")}

Overstocked Items (${overstockedItems.length}):
${overstockedItems
  .map((item) => `- ${item.name} (SKU: ${item.sku}): ${item.on_hand} units (reorder level: ${item.reorder_level})`)
  .join("\n")}

Total SKUs Managed: ${inventoryData.length}

Based on this data and the user's query: ${query}

Provide:
1. Which items to reorder urgently
2. Which items are overstocked and why
3. Suggested reorder quantities
4. Expected impact on working capital`;
    } else {
      // If no data is provided, use the query directly
      prompt = `You are an expert inventory optimization consultant.
    
Context: Help optimize inventory levels, reduce stockouts, and improve inventory turnover.

User Query: ${query}

Provide specific recommendations for inventory management and optimization. Include actionable steps.`;
    }

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Inventory analysis error:", error);
    throw new Error("Failed to generate inventory recommendations");
  }
}
