"use client";

import { useEffect } from "react";
import { useChat } from "@/lib/chat-context";
import { Chat } from "@/app/dashboard/components/chat";
import { Header } from "@/app/dashboard/components/header";
import { signOut } from "next-auth/react";

export default function ThreadPage({ params }: { params: { threadId: string } }) {
  const { threadId } = params;
  const { threads, selectThread } = useChat();
  
  // Select the thread when the page loads
  useEffect(() => {
    if (threadId) {
      selectThread(threadId);
    }
  }, [threadId, selectThread]);

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
