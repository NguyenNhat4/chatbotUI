"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ModeToggle } from "@/app/components/mode-toggle";

interface HeaderProps {
  username: string;
  handleSignOut: () => void;
}

export function Header({ username, handleSignOut }: HeaderProps) {
  const isMobile = useIsMobile();
  
  // Extract last name for mobile view
  const getLastName = () => {
    if (!username) return "User";
    const names = username.split(" ");
    return names.length > 1 ? names[names.length - 1] : username;
  };

  return (
    <header className="sticky top-0 bg-background p-4 shadow z-10 border-b">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger className="mr-2" />
          <h1 className="text-xl font-bold whitespace-nowrap">RHM Chatbot</h1>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4 ml-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:inline">
            {`Xin chào, Tôn Thất Tùng`}
            {/* Original code: {`Xin chào, ${username || "User"}`} */}
          </span>
          <button
            onClick={handleSignOut}
            className="rounded bg-secondary px-3 py-1 text-sm hover:bg-secondary/80 whitespace-nowrap"
          >
            Đăng xuất
          </button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
