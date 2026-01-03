"use client";

import React, { useState } from "react";
import { ChatMessages } from "@/app/dashboard/components/chat-messages";
import { ChatInput } from "@/app/dashboard/components/chat-input";
import { useChat } from "@/lib/chat-context";
import { Button } from "@/components/ui/button";
import { MessageCircleMore } from "lucide-react";
import { useRouter } from "next/navigation";

export function Chat() {
  const {
    activeThread,
    isLoading,
    isMessageLoading,
    sendMessage,
    createThread
  } = useChat();
  const router = useRouter();

  const [inputMessage, setInputMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("doctor_dental"); // Default role

  // Function to handle sending a message
  async function handleSendMessage(e: React.FormEvent, selectedRole?: string, deepResearch?: boolean) {
    e.preventDefault();

    if (!inputMessage.trim() || isMessageLoading) return;

    // If there's no active thread, create a new one with the first message as the name
    if (!activeThread) {
      try {
        const threadId = await createThread(inputMessage.trim().substring(0, 30) + (inputMessage.length > 30 ? '...' : ''));
        router.push(`/dashboard/thread/${threadId}`);
        // The sendMessage will be called after the thread is created and selected
        sendMessage(inputMessage, selectedRole, deepResearch);
        setInputMessage("");
        return;
      } catch (error) {
        console.error("Failed to create thread:", error);
        return;
      }
    }

    sendMessage(inputMessage, selectedRole, deepResearch);
    setInputMessage("");
  }

  return (
    <div className="flex-1 flex justify-center w-full">
      <main className="flex flex-col h-[calc(100vh-4.5rem)] max-w-4xl w-full p-4 relative">
        {activeThread ? (
          <>
            {/* Chat messages component */}
            <ChatMessages 
              messages={activeThread.messages} 
              isLoading={isMessageLoading}  // Only show loading when sending messages
              selectedRole={selectedRole}
            />

            {/* Chat input component - positioned at the bottom */}
            <div className="sticky bottom-0 z-10">
              <ChatInput 
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
                isLoading={isMessageLoading}
                onRoleChange={setSelectedRole}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Chào mừng đến với Trợ lý y tế
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Bắt đầu cuộc trò chuyện mới để nhận trợ giúp y tế từ trợ lý AI của chúng tôi.
            </p>
            <Button
              onClick={async () => {
                try {
                  const threadId = await createThread("Cuộc trò chuyện mới");
                  router.push(`/dashboard/thread/${threadId}`);
                } catch (error) {
                  console.error("Failed to create new chat:", error);
                }
              }}
              className="flex items-center gap-2"
            >
              <MessageCircleMore size={18} />
              Bắt đầu cuộc trò chuyện mới
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
