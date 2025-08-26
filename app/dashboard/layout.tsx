"use client";

import { useAuth } from "@/lib/auth-context";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/dashboard/components/app-sidebar";
import { ChatProvider } from "@/lib/chat-context";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  // Protect the dashboard layout
  if (!isLoading && !user) {
    redirect("/login");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Đang tải...</p>
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
