"use client";

import React from "react";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function ChatInput({ 
  inputMessage, 
  setInputMessage, 
  handleSendMessage, 
  isLoading 
}: ChatInputProps) {
  return (
    <form onSubmit={handleSendMessage} className="flex space-x-2">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type your medical question..."
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 disabled:bg-blue-300"
        disabled={isLoading || !inputMessage.trim()}
      >
        Send
      </button>
    </form>
  );
}
