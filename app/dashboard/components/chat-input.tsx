"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Send } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useRoles } from "@/lib/roles-service";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent, selectedRole?: string, deepResearch?: boolean) => void;
  isLoading: boolean;
  onRoleChange?: (roleId: string) => void;
}

export function ChatInput({ 
  inputMessage, 
  setInputMessage, 
  handleSendMessage, 
  isLoading,
  onRoleChange 
}: ChatInputProps) {
  const [deepResearch, setDeepResearch] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { roles, selectedRole, setSelectedRole, isLoading: rolesLoading } = useRoles();


  // Set default role to "Bác sĩ nha khoa" if available
  useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      const dentistRole = roles.find(role => role.name === "Bác sĩ chỉnh nha");
      if (dentistRole) {
        setSelectedRole(dentistRole.id);
      }
    }
  }, [roles, selectedRole, setSelectedRole]);

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
        handleSendMessage(e, selectedRole, deepResearch);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      handleSendMessage(e, selectedRole, deepResearch);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 px-3 pt-3 pb-2">
        <textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Hỏi bất cứ điều gì..."
          className="w-full h-12 focus:outline-none focus:ring-0 resize-none border-0 bg-transparent dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          disabled={isLoading}
        />
        <div className="flex items-center justify-between mt-0">
          <div className="flex items-center gap-3">
            {/* Role selector dropdown */}
            <div className="flex items-center">
              <Select
                value={selectedRole}
                onValueChange={(value) => {
                  setSelectedRole(value);
                  // Notify parent component about role change if callback exists
                  if (onRoleChange) {
                    onRoleChange(value);
                  }
                }}
                disabled={isLoading || rolesLoading}
              >
                <SelectTrigger 
                  className="w-[140px] h-8 text-xs border-gray-200 dark:border-gray-700 bg-transparent focus:ring-blue-500"
                  aria-label="Select role"
                >
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Deep research switch */}
            <div className="flex items-center gap-2">
              <Switch
                id="deep-research"
                checked={deepResearch}
                onCheckedChange={setDeepResearch}
                className="data-[state=checked]:bg-blue-600"
              />
              <Label htmlFor="deep-research" className="text-gray-600 dark:text-gray-300 font-medium cursor-pointer text-sm">
                Deep Research
              </Label>
            </div>
          </div>

          <button
            type="submit"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-gray-600 transition-colors"
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
