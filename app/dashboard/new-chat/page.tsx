"use client";

import { useEffect } from "react";
import { useChat } from "@/lib/chat-context";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Chat } from "@/app/dashboard/components/chat";
import { Header } from "@/app/dashboard/components/header";

export default function NewChatPage() {
  const { createThread } = useChat();
  const router = useRouter();
  
  useEffect(() => {
    // Create a new thread when the page loads
    const newThreadId = createThread("Cuộc trò chuyện mới");
    
    // Optionally redirect to the thread page
    // router.push(`/dashboard/thread/${newThreadId}`);
  }, []);

  const { user, logout } = useAuth();
  // const username = user?.email?.split('@')[0] || "User";
  const username = "Tôn Thất Tùng";
  
  return (
    <div className="flex flex-col h-screen">
      <Header 
        username={username}
        handleSignOut={() => logout()} 
      />
      {/* Original code: username={user?.email?.split('@')[0] || "User"} */}
      <Chat />
    </div>
  );
}
