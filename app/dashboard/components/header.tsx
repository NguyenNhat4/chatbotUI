"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  username: string;
  handleSignOut: () => void;
}

export function Header({ username, handleSignOut }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-white p-4 shadow z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center">
          <SidebarTrigger className="mr-2" />
          <h1 className="text-xl font-bold text-gray-800">Medical Chatbot</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Welcome, {username || "User"}
          </span>
          <button
            onClick={handleSignOut}
            className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
