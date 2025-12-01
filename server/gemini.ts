import { query } from "./db";

/**
 * FORECAST-FOCUSED CHATBOT WITH INTELLIGENT ROUTING
 * Returns different answers based on question intent
 */

function detectIntent(message: string): string {
  const lower = message.toLowerCase();
  
  // Keywords for different intents
  if (lower.match(/total|count|how many|summary|overview|all/i)) {
    return "overview";
  }
  if (lower.match(/store|location/i)) {
    return "stores";
  }
  if (lower.match(/product|item|sku/i)) {
    return "products";
  }
  if (lower.match(/date|range|when/i)) {
    return "dates";
  }
  if (lower.match(/model|algorithm|method/i)) {
    return "models";
  }
  if (lower.match(/recent|latest/i)) {
    return "recent";
  }
  if (lower.match(/hi|hello|hey|howdy/i)) {
    return "greeting";
  }
  
  return "unknown";
}

export async function analyzeInventoryWithAI(userMessage: string): Promise<string> {
  try {
    const intent = detectIntent(userMessage);
    
    switch (intent) {
      case "greeting":
        return `Hello! I'm your Inventory Assistant.\n\nI can help you with:\n- Forecast summaries\n- Store information\n- Product details\n- Date ranges\n- Model information\n- Recent forecasts\n\nWhat would you like to know?`;
      
      case "overview":
        return await getForecastOverview();
      
      case "stores":
        return await getStoresInfo();
      
      case "products":
        return await getProductsInfo();
      
      case "dates":
        return await getDateRangeInfo();
      
      case "models":
        return await getModelsInfo();
      
      case "recent":
        return await getRecentForecasts();
      
      case "unknown":
      default:
        return `Chatbot in Learning Phase\n\nI didn't quite understand that question.\n\nCurrently, I can help with:\n- Forecast overview\n- Store information\n- Product details\n- Date ranges\n- Models used\n- Recent forecasts\n\nFor more details contact: 1632634\n\nTry asking: "Show forecast overview" or "What stores do we have?"`;
    }
    
  } catch (error) {
    console.error("Chatbot error:", error);
    return `Chatbot in Learning Phase\n\nSorry, I encountered an error.\n\nFor more details contact: 1632634`;
  }
}

async function getForecastOverview(): Promise<string> {
  try {
    const countResult = await query("SELECT COUNT(*) as cnt FROM forecast_results LIMIT 1");
    const forecastCount = countResult.rows[0]?.cnt || 0;
    
    if (forecastCount === 0) {
      return "No forecast data available in the system.";
    }

    let response = `FORECAST DATA SUMMARY\n=====================================\n\n`;
    response += `Total Forecasts: ${forecastCount}\n`;
    
    try {
      const storeResult = await query("SELECT COUNT(DISTINCT store_id) as cnt FROM forecast_results");
      response += `Stores: ${storeResult.rows[0]?.cnt || 0}\n`;
    } catch (e) { }
    
    try {
      const prodResult = await query("SELECT COUNT(DISTINCT product_id) as cnt FROM forecast_results");
      response += `Products: ${prodResult.rows[0]?.cnt || 0}\n`;
    } catch (e) { }
    
    try {
      const dateResult = await query('SELECT MIN("date") as min_d, MAX("date") as max_d FROM forecast_results');
      const minD = dateResult.rows[0]?.min_d;
      const maxD = dateResult.rows[0]?.max_d;
      if (minD && maxD) {
        response += `Date Range: ${minD} to ${maxD}\n`;
      }
    } catch (e) { }
    
    return response;
  } catch (error) {
    console.error("Error getting overview:", error);
    return "Unable to retrieve forecast overview.";
  }
}

async function getStoresInfo(): Promise<string> {
  try {
    const result = await query("SELECT COUNT(DISTINCT store_id) as cnt, array_agg(DISTINCT store_id) as stores FROM forecast_results");
    const count = result.rows[0]?.cnt || 0;
    const stores = result.rows[0]?.stores || [];
    
    if (count === 0) {
      return "No store data available.";
    }
    
    return `STORE INFORMATION\n=====================================\n\nTotal Stores: ${count}\nStore IDs: ${stores.join(', ')}\n\nEach store has multiple forecasts in the system.`;
  } catch (error) {
    console.error("Error getting stores:", error);
    return "Unable to retrieve store information.";
  }
}

async function getProductsInfo(): Promise<string> {
  try {
    const result = await query("SELECT COUNT(DISTINCT product_id) as cnt, array_agg(DISTINCT product_id ORDER BY product_id) as products FROM forecast_results");
    const count = result.rows[0]?.cnt || 0;
    const products = result.rows[0]?.products || [];
    
    if (count === 0) {
      return "No product data available.";
    }
    
    return `PRODUCT INFORMATION\n=====================================\n\nTotal Products: ${count}\nProduct IDs: ${products.join(', ')}\n\nThese are the products we have forecasts for.`;
  } catch (error) {
    console.error("Error getting products:", error);
    return "Unable to retrieve product information.";
  }
}

async function getDateRangeInfo(): Promise<string> {
  try {
    const result = await query('SELECT MIN("date") as min_d, MAX("date") as max_d FROM forecast_results');
    const minDate = result.rows[0]?.min_d;
    const maxDate = result.rows[0]?.max_d;
    
    if (!minDate || !maxDate) {
      return "No date data available.";
    }
    
    return `DATE RANGE INFORMATION\n=====================================\n\nEarliest Forecast: ${minDate}\nLatest Forecast: ${maxDate}\n\nForecasts span across this period for all products and stores.`;
  } catch (error) {
    console.error("Error getting dates:", error);
    return "Unable to retrieve date information.";
  }
}

async function getModelsInfo(): Promise<string> {
  try {
    const result = await query("SELECT DISTINCT model FROM forecast_results LIMIT 10");
    const models = result.rows.map((r: any) => r.model).filter((m: any) => m);
    
    if (models.length === 0) {
      return "No model information available.";
    }
    
    return `MODELS USED\n========================================\n\nModels in System:\n${models.map((m, i) => `${i + 1}. ${m}`).join('\n')}\n\nThese are the forecasting models being used.`;
  } catch (error) {
    console.error("Error getting models:", error);
    return "Unable to retrieve model information.";
  }
}

async function getRecentForecasts(): Promise<string> {
  try {
    const result = await query("SELECT * FROM forecast_results ORDER BY forecast_id DESC LIMIT 3");
    
    if (result.rows.length === 0) {
      return "No recent forecasts available.";
    }
    
    let response = `RECENT FORECASTS (LAST 3)\n=====================================\n\n`;
    result.rows.forEach((row: any, idx: number) => {
      response += `${idx + 1}. Forecast ID: ${row.forecast_id}\n`;
      response += `   Store: ${row.store_id} | Product: ${row.product_id}\n`;
      response += `   Date: ${row.date}\n`;
      if (row.forecast_qty) response += `   Forecast Qty: ${row.forecast_qty}\n`;
      if (row.model) response += `   Model: ${row.model}\n`;
      response += `\n`;
    });
    
    return response;
  } catch (error) {
    console.error("Error getting recent:", error);
    return "Unable to retrieve recent forecasts.";
  }
}

// Legacy compatibility functions
export async function generateProfitAnalysis(query_text: string): Promise<string> {
  return analyzeInventoryWithAI(query_text);
}

export async function generateInventoryRecommendations(query_text: string): Promise<string> {
  return analyzeInventoryWithAI(query_text);
}
