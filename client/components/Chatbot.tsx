import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Loader, PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const QUICK_QUESTIONS = [
  "Which products are most profitable?",
  "What items need reordering?",
  "Show inventory health",
  "Analyze sales trends",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ id: string; text: string; sender: "user" | "bot"; timestamp: string }[]>(
    [
      {
        id: "1",
        text: "Hi! I'm your inventory assistant. I can help you analyze profits, inventory levels, and product performance. What would you like to know?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      },
    ]
  );
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || inputValue.trim();
    if (!messageToSend) return;
    const newUserMessage = {
      id: Date.now().toString(),
      text: messageToSend,
      sender: "user" as const,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Detect context from user message
      let context = "general";
      if (messageToSend.toLowerCase().includes("profit") || messageToSend.toLowerCase().includes("earning")) {
        context = "profit";
      } else if (messageToSend.toLowerCase().includes("inventory") || messageToSend.toLowerCase().includes("stock")) {
        context = "inventory";
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: data.message || "I couldn't process that. Please try again.",
        sender: "bot" as const,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again later.",
        sender: "bot" as const,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:shadow-xl transition-all hover:scale-105 z-40"
        size="icon"
        title="Open chat assistant"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      <Card
        className={cn(
          "fixed bottom-24 right-4 w-96 max-w-[calc(100vw-2rem)] shadow-2xl transition-transform duration-300 ease-in-out z-40",
          isOpen ? "translate-y-0" : "translate-y-[150%]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-primary to-primary/80 p-4 text-primary-foreground">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 bg-primary-foreground/10">
              <PackageSearch className="h-4 w-4 text-primary-foreground" />
            </Avatar>
            <div>
              <h3 className="font-semibold">Inventory Assistant</h3>
              <p className="text-xs opacity-90">AI-powered helper</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[400px] p-4">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2 items-start",
                  message.sender === "user" ? "flex-row-reverse" : ""
                )}
              >
                {message.sender === "bot" && (
                  <Avatar className="h-8 w-8 bg-primary">
                    <PackageSearch className="h-4 w-4 text-primary-foreground" />
                  </Avatar>
                )}
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 bg-muted">
                    <MessageCircle className="h-4 w-4" />
                  </Avatar>
                )}
                <div
                  className={cn(
                    "rounded-lg p-3 max-w-[80%]",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-[10px] opacity-50 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 items-start">
                <Avatar className="h-8 w-8 bg-primary">
                  <PackageSearch className="h-4 w-4 text-primary-foreground" />
                </Avatar>
                <div className="bg-muted rounded-lg p-3 flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Questions */}
        <div className="border-t border-border bg-secondary/20 px-4 py-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Quick questions:</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_QUESTIONS.map((question) => (
              <Button
                key={question}
                variant="ghost"
                className="h-auto py-1.5 px-2 text-xs justify-start font-normal hover:bg-primary/10"
                onClick={() => handleSendMessage(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t p-4 flex gap-2">
          <Input
            placeholder="Ask about inventory, profits, or forecasts..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </>
  );
}