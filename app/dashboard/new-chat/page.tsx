"use client";

import { useEffect } from "react";
import { useChat } from "@/lib/chat-context";
import { useRouter } from "next/navigation";
import { Chat } from "@/app/dashboard/components/chat";
import { Header } from "@/app/dashboard/components/header";
import { signOut } from "next-auth/react";

export default function NewChatPage() {
  const { createThread } = useChat();
  const router = useRouter();
  
  useEffect(() => {
    // Create a new thread when the page loads
    const newThreadId = createThread("Cuộc trò chuyện mới");
    
    // Optionally redirect to the thread page
    // router.push(`/dashboard/thread/${newThreadId}`);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header 
        username="User" 
        handleSignOut={() => signOut()} 
      />
      <Chat />
    </div>
  );
}
