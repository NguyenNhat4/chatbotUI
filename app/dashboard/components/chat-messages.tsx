"use client";

import React, { useRef, useEffect } from "react";
import { Message } from "@/types/chat";
import { format } from "date-fns";
import { useChat } from "@/lib/chat-context";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendSuggestion } = useChat();
  
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
            } flex-col`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-blue-500 dark:bg-primary text-white dark:text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              } ${message.role === "user" ? "self-end" : "self-start"}`}
            >
              {/* Show summary at the top if available */}
              {/* {message.role === "bot" && message.summary && (
                <div className="font-semibold mb-2">{message.summary}</div>
              )} */}
              
              {/* Display message content - allowing for line breaks and formatting */}
              <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br>') }} />
              
              {/* Display timestamp */}
              <p className={`text-xs mt-1 ${
                message.role === "user"
                  ? "text-white/70 dark:text-primary-foreground/70"
                  : "text-secondary-foreground/70"
              }`}>
                {format(new Date(message.timestamp), 'HH:mm')}
              </p>
            </div>
            
            {/* Show suggestions if available */}
            {message.role === "bot" && message.suggestions && message.suggestions.length > 0 && (
              <div className="mt-2 self-start">
                <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Gợi ý câu hỏi:</p>
                <div className="flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm px-3 py-1.5 rounded-full"
                      onClick={() => sendSuggestion(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Show clarification needed message if required */}
            {message.role === "bot" && message.needClarify && (
              <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm text-yellow-800 dark:text-yellow-200 self-start">
                <p>Tôi cần thêm thông tin để trả lời câu hỏi của bạn một cách chính xác hơn.</p>
              </div>
            )}
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
