"use client";

import React, { useRef, useEffect } from "react";
import { Message } from "@/types/chat";
import { format } from "date-fns";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="mb-4 flex-1 overflow-y-auto rounded-lg bg-background p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-blue-500 dark:bg-primary text-white dark:text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <p>{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === "user"
                  ? "text-white/70 dark:text-primary-foreground/70"
                  : "text-secondary-foreground/70"
              }`}>
                {format(new Date(message.timestamp), 'HH:mm')}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg bg-secondary px-4 py-2 text-secondary-foreground">
              <p>Đang suy nghĩ...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
