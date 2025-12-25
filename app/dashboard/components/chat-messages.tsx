"use client";

import React, { useRef, useEffect, useState } from "react";
import { Message } from "@/types/chat";
import { format } from "date-fns";
import { useChat } from "@/lib/chat-context";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import bgRang from "@/assets/bg-rang.jpeg";
import { ThinkingAnimation } from "@/components/ui/thinking-animation";
import { Copy, Check } from "lucide-react";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  selectedRole?: string; // Add the selectedRole prop
}

export function ChatMessages({ messages, isLoading, selectedRole }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendSuggestion } = useChat();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Function to determine which background to use based on the selected role
  const getBackgroundImage = () => {
   return bgRang.src;
  };

  // Function to copy message content to clipboard
  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Process markdown content to enhance formatting
  const processContent = (content: string) => {
    // Convert ### headers to proper Markdown headers with special formatting
    const processedContent = content.replace(/###\s+(.*?)$/gm, '## $1');
    
    // Ensure all bold text (**text**) is preserved
    // ReactMarkdown will handle this automatically
    
    return processedContent;
  };

  return (
    <div 
      className="mb-4 flex-1 overflow-y-auto rounded-lg p-4 bg-cover bg-center scrollbar-hide" 
      style={{ 
        backgroundImage: `url(${getBackgroundImage()})`,
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none' /* IE and Edge */
      }}
    >
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } flex-col`}
          >
            <div className="relative group">
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-blue-500/80 dark:bg-primary/80 text-white dark:text-primary-foreground"
                    : "bg-secondary/80 text-secondary-foreground"
                } ${message.role === "user" ? "self-end" : "self-start"}`}
              >
                {/* Display message content with enhanced Markdown formatting */}
                {message.role === "user" ? (
                  <div className="whitespace-pre-line text-base text-justify">
                    {message.content}
                  </div>
                ) : (
                  <div className="markdown-content text-justify">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h2: (props) => <h2 className="text-2xl font-bold mt-4 mb-3 text-primary dark:text-primary" {...props} />,
                        h3: (props) => <h3 className="text-xl font-bold mt-3 mb-2 text-primary dark:text-primary" {...props} />,
                        p: (props) => <p className="text-lg mb-3 leading-relaxed text-justify" {...props} />,
                        strong: (props) => <strong className="font-bold text-primary dark:text-blue-300 text-lg" {...props} />,
                        ul: (props) => <ul className="list-disc ml-6 mb-3" {...props} />,
                        ol: (props) => <ol className="list-decimal ml-6 mb-3" {...props} />,
                        li: (props) => <li className="text-lg mb-1" {...props} />,
                      }}
                    >
                      {processContent(message.content)}
                    </ReactMarkdown>
                  </div>
                )}

                {/* Display timestamp */}
                <p className={`text-xs mt-1 ${
                  message.role === "user"
                    ? "text-white/70 dark:text-primary-foreground/70"
                    : "text-secondary-foreground/70"
                }`}>
                  {format(new Date(message.timestamp), 'HH:mm')}
                </p>
              </div>

              {/* Copy button - show on hover */}
              <button
                onClick={() => copyToClipboard(message.content, message.id)}
                className={`absolute -top-2 ${message.role === "user" ? "-left-8" : "-right-8"} opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md ${
                  message.role === "user"
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                }`}
                title="Copy message"
              >
                {copiedId === message.id ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            
            {/* Show suggestions if available */}
            {message.role === "bot" && message.suggestions && message.suggestions.length > 0 && (
              <div className="mt-2 self-start">
                <p className="text-sm font-semibold mb-1 text-gray-900 dark:text-gray-100">Gợi ý câu hỏi:</p>
                <div className="flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="bg-gray-100/80 hover:bg-gray-200/80 dark:bg-gray-700/80 dark:hover:bg-gray-600/80 text-gray-800 dark:text-gray-200 text-sm px-3 py-1.5 rounded-full"
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
              <div className="mt-2 p-2 bg-yellow-50/80 dark:bg-yellow-900/60 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm text-yellow-800 dark:text-yellow-200 self-start">
                <p>Tôi cần thêm thông tin để trả lời câu hỏi của bạn một cách chính xác hơn.</p>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg bg-secondary/80 px-4 py-3 text-secondary-foreground shimmer">
              {/* Bạn có thể chọn một trong các hiệu ứng sau: */}
              
              {/* Hiệu ứng cơ bản với dots bouncing */}
              <ThinkingAnimation variant="dots" text="Đang suy nghĩ" />
              
              {/* Các tùy chọn khác (uncomment để thử): */}
              {/* <ThinkingAnimation variant="pulse" text="Đang xử lý" /> */}
              {/* <ThinkingAnimation variant="wave" text="Đang phân tích" /> */}
              {/* <ThinkingAnimation variant="typing" text="Đang soạn câu trả lời" /> */}
              {/* <ThinkingAnimation variant="brain" text="Đang suy nghĩ" /> */}
              {/* <ThinkingAnimation variant="spinner" text="Đang tải" /> */}
              
              {/* Hiệu ứng cao cấp với brain và particles */}
              {/* <AdvancedThinkingAnimation text="AI đang phân tích câu hỏi của bạn" /> */}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
