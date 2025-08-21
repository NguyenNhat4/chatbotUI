"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/dashboard/components/app-sidebar";
import { ChatProvider } from "@/lib/chat-context";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  // Protect the dashboard layout
  if (status === "unauthenticated") {
    redirect("/login");
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <ChatProvider>
        <AppSidebar />
        {children}
      </ChatProvider>
    </SidebarProvider>
  )
}
