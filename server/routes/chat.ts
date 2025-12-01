import { RequestHandler } from "express";
import { ChatRequest, ChatResponse } from "@shared/api";
import { analyzeInventoryWithAI, generateProfitAnalysis, generateInventoryRecommendations } from "../gemini";

export const handleChat: RequestHandler = async (req, res) => {
  try {
    const { message } = req.body as ChatRequest;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        message: "Please enter a message"
      });
    }

    const lowerMessage = message.toLowerCase();
    let response: string;

    // Detect intent from message
    if (lowerMessage.includes("profit") || lowerMessage.includes("value") || lowerMessage.includes("expensive") || lowerMessage.includes("earning")) {
      response = await generateProfitAnalysis(message);
    } else if (lowerMessage.includes("reorder") || lowerMessage.includes("low stock") || lowerMessage.includes("suggest") || lowerMessage.includes("recommend")) {
      response = await generateInventoryRecommendations(message);
    } else {
      // Default to inventory analysis
      response = await analyzeInventoryWithAI(message);
    }

    const chatResponse: ChatResponse = {
      message: response
    };

    res.status(200).json(chatResponse);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      message: "Failed to process your request. Please try again."
    });
  }
};