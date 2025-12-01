import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Loader, PackageSearch, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";

const QUICK_QUESTIONS = [
  "What inventory should I stock more of?",
  "How can I reduce carrying costs?",
  "What are my top performing products?",
  "How should I price my high-demand items?",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<{ id: string; text: string; sender: "user" | "bot"; timestamp: string }[]>(
    [
      {
        id: "1",
        text: "👋 Hi! I'm your AI inventory assistant powered by Groq. I can help you with inventory optimization, demand forecasting, profit analysis, and supply chain recommendations. What can I help you with today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      },
    ]
  );
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputValue(transcript);

        // Auto-send if final result
        if (event.results[event.results.length - 1].isFinal) {
          setTimeout(() => {
            handleSendMessage(transcript);
          }, 500);
        }
      };
    }
  }, []);

  const handleVoiceInput = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        setInputValue("");
        recognitionRef.current.start();
      }
    }
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
      console.log("📨 Sending message to:", user ? "/api/chat" : "/api/chat/public");
      const response = await api.post(user ? "/chat" : "/chat/public", {
        message: messageToSend,
      });

      const data = response.data;
      console.log("✅ Chat response received:", data);

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: data.message || "I couldn't process that. Please try again.",
        sender: "bot" as const,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error details:", error);
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
          "fixed bottom-24 right-4 w-96 max-w-[calc(100vw-2rem)] shadow-2xl transition-transform duration-300 ease-in-out z-40 rounded-2xl",
          isOpen ? "translate-y-0" : "translate-y-[150%]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-cyan-500 p-3 text-white rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 bg-white rounded-full flex items-center justify-center">
              <img
                src="/chatbot.png"
                alt="Bot Avatar"
                className="h-7 w-7 object-contain rounded-full"
              />
            </Avatar>

            <div>
              <h3 className="font-semibold text-sm">Inventory Assistant</h3>
              <p className="text-[11px] opacity-80">Powered by Groq</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[320px] p-3">
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2 items-start",
                  message.sender === "user" ? "flex-row-reverse" : ""
                )}
              >
                {/* {message.sender === "bot" && (
                  <Avatar className="h-8 w-8 bg-primary">
                    <PackageSearch className="h-4 w-4 text-primary-foreground" />
                  </Avatar>
                )} */}
                {message.sender === "bot" && (
  <Avatar className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
    <img
      src="/chatbot.png"
      alt="Bot Avatar"
      className="h-8 w-8 object-contain rounded-full"
    />
  </Avatar>
)}

                {/* {message.sender === "user" && (
                  <Avatar className="h-8 w-8 bg-muted">
                    <MessageCircle className="h-4 w-4" />
                  </Avatar>
                )} */}
                {message.sender === "user" && (
  <Avatar className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
    <img
      src="/user.png"
      alt="User Avatar"
      className="h-8 w-8 object-contain rounded-full"
    />
  </Avatar>
)}

                <div
                  className={cn(
                    "rounded-lg p-2 max-w-[80%] text-sm",
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-[10px] opacity-50 mt-0.5 block">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 items-start">
                {/* <Avatar className="h-8 w-8 bg-primary">
                  <PackageSearch className="h-4 w-4 text-primary-foreground" />
                </Avatar> */}
                <Avatar className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
  <img
    src="/chatbot.png"
    alt="Bot Avatar"
    className="h-8 w-8 object-contain rounded-full"
  />
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
        <div className="border-t border-gray-200 bg-gray-50 px-3 py-2 space-y-1.5">
          <p className="text-[11px] font-semibold text-gray-600">Quick questions:</p>
          <div className="grid grid-cols-2 gap-1.5">
            {QUICK_QUESTIONS.slice(0, 2).map((question) => (
              <Button
                key={question}
                variant="ghost"
                className="h-auto py-1 px-1.5 text-[11px] justify-start font-normal hover:bg-blue-100 text-gray-700"
                onClick={() => handleSendMessage(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-2.5 flex gap-1.5 bg-white rounded-b-2xl">
          <Input
            placeholder="Ask me anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading || isListening}
            className="flex-1 h-8 text-sm"
          />
          <Button
            onClick={handleVoiceInput}
            size="sm"
            variant={isListening ? "default" : "outline"}
            title={isListening ? "Stop listening..." : "Click to speak"}
            className={`h-8 w-8 p-0 ${isListening ? "bg-red-500 hover:bg-red-600" : ""}`}
          >
            {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
          </Button>
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>
    </>
  );
}