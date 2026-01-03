"use client";

import { use, useEffect } from "react";
import { useChat } from "@/lib/chat-context";
import { useAuth } from "@/lib/auth-context";
import { Chat } from "@/app/dashboard/components/chat";
import { Header } from "@/app/dashboard/components/header";

export default function ThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = use(params);
  const { activeThreadId, selectThread } = useChat();

  // Select the thread when the page loads or threadId changes
  useEffect(() => {
    // Only select if it's not already the active thread
    if (threadId && threadId !== activeThreadId) {
      selectThread(threadId);
    }
  }, [threadId, activeThreadId, selectThread]);

  const { user, logout } = useAuth();
  const username = user?.email?.split('@')[0] || "User";

  return (
    <>
      <Header
        username={username}
        handleSignOut={() => logout()}
      />
      <Chat />
    </>
  );
}
