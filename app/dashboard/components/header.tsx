"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

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
    <header className="sticky top-0 bg-white p-4 shadow z-10">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger className="mr-2" />
          <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap">RHM Chatbot</h1>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4 ml-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {isMobile ? `Hello, ${getLastName()}` : `Xin chào, ${username || "User"}`}
          </span>
          <button
            onClick={handleSignOut}
            className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300 whitespace-nowrap"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}
