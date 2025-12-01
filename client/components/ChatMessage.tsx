// import { MessageCircle, PackageSearch } from "lucide-react";
// import { Avatar } from "@/components/ui/avatar";
// import { cn } from "@/lib/utils";

// interface ChatMessageProps {
//   text: string;
//   sender: "user" | "bot";
//   timestamp: string;
// }

// export function ChatMessage({ text, sender, timestamp }: ChatMessageProps) {
//   return (
//     <div className={cn("flex gap-2 items-start", sender === "user" ? "flex-row-reverse" : "")}>
//       {sender === "bot" && (
//         <Avatar className="h-8 w-8 bg-primary">
//           <PackageSearch className="h-4 w-4 text-primary-foreground" />
//         </Avatar>
//       )}
//       {sender === "user" && (
//         <Avatar className="h-8 w-8 bg-muted">
//           <MessageCircle className="h-4 w-4" />
//         </Avatar>
//       )}
//       <div
//         className={cn(
//           "rounded-lg p-3 max-w-[80%]",
//           sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
//         )}
//       >
//         <p className="text-sm">{text}</p>
//         <span className="text-[10px] opacity-50 mt-1 block">
//           {new Date(timestamp).toLocaleTimeString()}
//         </span>
//       </div>
//     </div>
//   );
// }
//  MODIFICATION USING gpT
import { MessageCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

export function ChatMessage({ text, sender, timestamp }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-2 items-start",
        sender === "user" ? "flex-row-reverse" : ""
      )}
    >
      {/* BOT ICON */}
      {sender === "bot" && (
        <Avatar className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
          <img
            src="/chatbot.png"
            alt="Bot Avatar"
            className="h-8 w-8 object-contain rounded-full"
          />
        </Avatar>
      )}

      {/* USER ICON */}
      {sender === "user" && (
        <Avatar className="h-8 w-8 bg-muted flex items-center justify-center">
          <MessageCircle className="h-4 w-4" />
        </Avatar>
      )}

      {/* MESSAGE */}
      <div
        className={cn(
          "rounded-lg p-3 max-w-[80%]",
          sender === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <p className="text-sm">{text}</p>
        <span className="text-[10px] opacity-50 mt-1 block">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
