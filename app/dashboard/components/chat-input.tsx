"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Send } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";


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
  const [deepResearch, setDeepResearch] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus the textarea when the component mounts or after sending a message
  useEffect(() => {
    if (textareaRef.current && !isLoading) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  // Handle key press events (Enter to submit)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim() && !isLoading) {
        handleSendMessage(e);
      }
    }
  };

  return (
    <form onSubmit={handleSendMessage}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-3 pt-3 pb-2">
        <textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Hỏi bất cứ điều gì..."
          className="w-full h-12 focus:outline-none focus:ring-0 resize-none border-0"
          disabled={isLoading}
        />
        <div className="flex items-center justify-between mt-0">
          <div className="flex items-center gap-2">
            <Switch
              id="deep-research"
              checked={deepResearch}
              onCheckedChange={setDeepResearch}
              className="data-[state=checked]:bg-blue-600"
            />
            <Label htmlFor="deep-research" className="text-gray-600 font-medium cursor-pointer text-sm">
              Deep Research
            </Label>
          </div>

          <button
            type="submit"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
            disabled={isLoading || !inputMessage.trim()}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
      
    </form>
  );
}
