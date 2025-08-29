"use client";

import React, { useRef, useEffect } from "react";
import { Message } from "@/types/chat";
import { format } from "date-fns";
import { useChat } from "@/lib/chat-context";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import bgRang from "@/assets/bg-rang.jpeg";
import bgNoitiet from "@/assets/bg-noitiet.jpeg";
import demoChat1 from "@/assets/demo-chat1.jpg";
import demoChat2 from "@/assets/demochat2.jpg";
import Image from "next/image";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  selectedRole?: string; // Add the selectedRole prop
}

export function ChatMessages({ messages, isLoading, selectedRole }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendSuggestion } = useChat();
  
  // Function to determine which background to use based on the selected role
  const getBackgroundImage = () => {
    if (!selectedRole) return bgRang.src; // Default to bgRang if no role selected
    
    // If the role includes "dental" or "nha khoa", use bgRang
    if (selectedRole.includes('dental') || selectedRole.includes('patient_dental')) {
      return bgRang.src;
    }
    // For endocrine (nội tiết) or diabetes (đái tháo đường) roles, use bgNoitiet
    return bgNoitiet.src;
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
    let processedContent = content.replace(/###\s+(.*?)$/gm, '## $1');
    
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
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-blue-500/80 dark:bg-primary/80 text-white dark:text-primary-foreground"
                  : "bg-secondary/80 text-secondary-foreground"
              } ${message.role === "user" ? "self-end" : "self-start"}`}
            >
              {/* Show summary at the top if available */}
              {/* {message.role === "bot" && message.summary && (
                <div className="font-semibold mb-2">{message.summary}</div>
              )} */}
              
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
                      h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-4 mb-3 text-primary dark:text-primary" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-3 mb-2 text-primary dark:text-primary" {...props} />,
                      p: ({node, ...props}) => <p className="text-lg mb-3 leading-relaxed text-justify" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-primary dark:text-blue-300 text-lg" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-3" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-3" {...props} />,
                      li: ({node, ...props}) => <li className="text-lg mb-1" {...props} />,
                    }}
                  >
                    {processContent(message.content)}
                  </ReactMarkdown>
                  
                  {/* Thêm hình ảnh sau mỗi câu trả lời của bot, trừ câu chào đầu tiên */}
                  {message.content !== "Xin chào! Tôi là trợ lý AI của bạn. Rất vui được hỗ trợ bạn - Bạn cần tôi giúp gì hôm nay?" && (
                    <div className="mt-3">
                      <Image 
                        src={demoChat2} 
                        alt="Hình ảnh minh họa" 
                        width={400} 
                        height={300}
                        className="rounded-lg shadow-md" 
                      />
                    </div>
                  )}
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
            
            {/* Show suggestions if available */}
            {message.role === "bot" && message.suggestions && message.suggestions.length > 0 && (
              <div className="mt-2 self-start">
                <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Gợi ý câu hỏi:</p>
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
            <div className="max-w-[80%] rounded-lg bg-secondary/80 px-4 py-2 text-secondary-foreground">
              <p>Đang suy nghĩ...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
