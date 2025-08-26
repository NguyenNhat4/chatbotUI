"use client";

import { useEffect } from "react";
import { useChat } from "@/lib/chat-context";
import { useAuth } from "@/lib/auth-context";
import { Chat } from "@/app/dashboard/components/chat";
import { Header } from "@/app/dashboard/components/header";

export default function ThreadPage({ params }: { params: { threadId: string } }) {
  const { threadId } = params;
  const { threads, selectThread } = useChat();
  
  // Select the thread when the page loads
  useEffect(() => {
    if (threadId) {
      selectThread(threadId);
    }
  }, [threadId, selectThread]);

  const { user, logout } = useAuth();
  const username = user?.email?.split('@')[0] || "User";

  return (
    <div className="flex flex-col h-screen">
      <Header 
        username={username} 
        handleSignOut={() => logout()} 
      />
      <Chat />
    </div>
  );
}
