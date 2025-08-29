"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
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
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // If the user is not authenticated and not loading, redirect to login
  if (!user && !isLoading) {
    router.push("/login");
    return null;
  }

  // If auth is still loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  // Function to handle sign out
  function handleSignOut() {
    logout();
  }

  return (
    <div className="flex flex-col flex-1 w-full min-h-screen">
      {/* Header component */}
      <Header 
        username={"Tôn Thất Tùng"} 
        handleSignOut={handleSignOut} 
      />
      {/* Original code: username={user?.email?.split('@')[0] || "User"} */}

      {/* Chat component */}
      <Chat />
    </div>
  );
}
