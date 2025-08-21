"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/dashboard/components/app-sidebar";
import { Header } from "@/app/dashboard/components/header";
import { Chat } from "@/app/dashboard/components/chat";

// Message type for the chat
interface Message {
  role: "user" | "bot";
  content: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();

  // If the user is not authenticated, redirect to login
  if (status === "unauthenticated") {
    redirect("/login");
  }

  // If the session is still loading, show a loading state
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  // Function to handle sign out
  async function handleSignOut() {
    await signOut({ redirect: true, callbackUrl: "/" });
  }

  return (
    <div className="flex flex-col flex-1 w-full min-h-screen">
      {/* Header component */}
      <Header 
        username={session?.user?.name || ""} 
        handleSignOut={handleSignOut} 
      />

      {/* Chat component */}
      <Chat />
    </div>
  );
}
