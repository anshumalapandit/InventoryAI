import { RequestHandler } from "express";
import { ChatRequest, ChatResponse } from "@shared/api";
import { analyzeInventoryWithAI, generateProfitAnalysis, generateInventoryRecommendations } from "../gemini";

export const handleChat: RequestHandler = async (req, res) => {
  try {
    const { message, context } = req.body as ChatRequest;

    let response: string;
    switch (context) {
      case 'inventory':
        response = await analyzeInventoryWithAI(message);
        break;
      case 'profit':
        response = await generateProfitAnalysis(message);
        break;
      default:
        response = await generateInventoryRecommendations(message);
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