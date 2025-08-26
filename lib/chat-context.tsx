"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Message, Thread } from "@/types/chat";
import { v4 as uuidv4 } from "uuid"; // You'll need to install this package

interface ChatContextType {
  threads: Thread[];
  activeThreadId: string | null;
  createThread: (name: string) => string; // Returns the thread ID
  deleteThread: (threadId: string) => void;
  sendMessage: (content: string, role?: string) => void;
  sendSuggestion: (suggestion: string) => void;
  selectThread: (threadId: string) => void;
  renameThread: (threadId: string, newName: string) => void;
  activeThread: Thread | null;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // On first load, try to get threads from local storage
  useEffect(() => {
    const savedThreads = localStorage.getItem("chatThreads");
    if (savedThreads) {
      try {
        const parsedThreads = JSON.parse(savedThreads, (key, value) => {
          if (key === "createdAt" || key === "updatedAt" || key === "timestamp") {
            return new Date(value);
          }
          return value;
        });
        setThreads(parsedThreads);
        
        // Set the most recent thread as active if it exists
        if (parsedThreads.length > 0) {
          setActiveThreadId(parsedThreads[0].id);
        }
      } catch (error) {
        console.error("Failed to load chat threads:", error);
      }
    }
  }, []);

  // Save threads to local storage whenever they change
  useEffect(() => {
    if (threads.length > 0) {
      localStorage.setItem("chatThreads", JSON.stringify(threads));
    }
  }, [threads]);

  const activeThread = activeThreadId 
    ? threads.find(thread => thread.id === activeThreadId) || null
    : null;

  const createThread = (name: string) => {
    const newThread: Thread = {
      id: uuidv4(),
      name,
      messages: [{
        id: uuidv4(),
        role: "bot",
        content: "Xin chào! Tôi là phụ tá AI thông minh của bạn đây. Xem tôi có thể giúp gì được nào?",
        timestamp: new Date()
      }],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "current-user-id" // In a real app, get this from authentication
    };

    setThreads(prevThreads => [newThread, ...prevThreads]);
    setActiveThreadId(newThread.id);
    return newThread.id;
  };

  const deleteThread = (threadId: string) => {
    setThreads(prevThreads => prevThreads.filter(thread => thread.id !== threadId));
    
    if (activeThreadId === threadId) {
      // Set the next thread as active, or null if no threads left
      setActiveThreadId(threads.length > 1 ? threads[0].id : null);
    }
  };

  const sendMessage = async (content: string, role?: string) => {
    if (!activeThreadId || !content.trim() || isLoading) return;

    const userMessageId = uuidv4();
    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
      apiRole: role // Include the role in the message
    };

    // Update the thread with the user message
    setThreads(prevThreads => 
      prevThreads.map(thread => 
        thread.id === activeThreadId 
          ? {
              ...thread,
              messages: [...thread.messages, userMessage],
              updatedAt: new Date()
            }
          : thread
      )
    );

    setIsLoading(true);

    try {
      // Call the dental chatbot API
      const response = await fetch('https://denti-chatbot.hiaivn.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          role: role || 'default',
          session_id: activeThreadId // Using thread ID as session ID
        })
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Create a bot message from the API response
      const botMessage: Message = {
        id: uuidv4(),
        role: "bot",
        content: data.explanation || "Sorry, I couldn't process your request.",
        timestamp: new Date(),
        suggestions: data.questionSuggestion,
        summary: data.summary,
        needClarify: data.need_clarify,
        inputType: data.input_type,
        sessionId: data.session_id // Store the session ID from the API
      };
      
      // If the API returns a session_id, update the thread with it
      if (data.session_id && data.session_id !== activeThreadId) {
        console.log(`API returned session_id: ${data.session_id}`);
      }

      // Update the thread with the bot message
      setThreads(prevThreads => 
        prevThreads.map(thread => 
          thread.id === activeThreadId 
            ? {
                ...thread,
                messages: [...thread.messages, botMessage],
                updatedAt: new Date()
              }
            : thread
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add an error message to the thread
      const errorMessage: Message = {
        id: uuidv4(),
        role: "bot",
        content: "Sorry, there was an error processing your request. Please try again later.",
        timestamp: new Date(),
      };
      
      setThreads(prevThreads => 
        prevThreads.map(thread => 
          thread.id === activeThreadId 
            ? {
                ...thread,
                messages: [...thread.messages, errorMessage],
                updatedAt: new Date()
              }
            : thread
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const selectThread = (threadId: string) => {
    setActiveThreadId(threadId);
  };

  const renameThread = (threadId: string, newName: string) => {
    if (!newName.trim()) return;

    setThreads(prevThreads => 
      prevThreads.map(thread => 
        thread.id === threadId 
          ? { ...thread, name: newName.trim() }
          : thread
      )
    );
  };

  // Function to send a suggested question as a new message
  const sendSuggestion = (suggestion: string) => {
    if (suggestion.trim()) {
      sendMessage(suggestion.trim());
    }
  };

  return (
    <ChatContext.Provider value={{
      threads,
      activeThreadId,
      createThread,
      deleteThread,
      sendMessage,
      sendSuggestion,
      selectThread,
      renameThread,
      activeThread,
      isLoading
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
