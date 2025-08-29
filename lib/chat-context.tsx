"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Message, Thread } from "@/types/chat";
import { v4 as uuidv4 } from "uuid";
import chatApi from "./chat-api";
import { useAuth } from "./auth-context";

interface ChatContextType {
  threads: Thread[];
  activeThreadId: string | null;
  createThread: (name: string) => Promise<string>; // Returns the thread ID as a Promise
  deleteThread: (threadId: string) => Promise<void>;
  sendMessage: (content: string, role?: string) => Promise<void>;
  sendSuggestion: (suggestion: string) => Promise<void>;
  selectThread: (threadId: string) => Promise<void>;
  renameThread: (threadId: string, newName: string) => Promise<void>;
  activeThread: Thread | null;
  isLoading: boolean;
  isMessageLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuth();

  // On first load, fetch threads from API
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const threadsData = await chatApi.getThreads();
        
        // Convert dates
        const processedThreads = threadsData.map((thread: any) => ({
          id: thread.id,
          name: thread.name,
          createdAt: new Date(thread.createdAt),
          updatedAt: new Date(thread.updatedAt),
          messages: [], // We'll load messages when selecting a thread
          userId: user?.id?.toString() || "guest-user" // Get user ID from auth context
        }));
        
        setThreads(processedThreads);
        
        // Set the most recent thread as active if it exists
        if (processedThreads.length > 0) {
          setActiveThreadId(processedThreads[0].id);
          
          // Immediately load messages for the most recent thread
          const mostRecentThreadId = processedThreads[0].id;
          const threadData = await chatApi.getThread(mostRecentThreadId);
          
          // Process messages
          const messages = threadData.messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp),
            apiRole: msg.apiRole,
            suggestions: msg.suggestions,
            summary: msg.summary,
            needClarify: msg.needClarify,
            inputType: msg.inputType
          }));
          
          // Update the thread with messages
          setThreads(prevThreads => 
            prevThreads.map(thread => 
              thread.id === mostRecentThreadId 
                ? { ...thread, messages } 
                : thread
            )
          );
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to load chat threads:", error);
        setIsInitialized(true);
      }
    };
    
    fetchThreads();
  }, []);

  const activeThread = activeThreadId 
    ? threads.find(thread => thread.id === activeThreadId) || null
    : null;

  const createThread = async (name: string) => {
    try {
      // Create thread via API
      const response = await chatApi.createThread(name);
      
      // Create thread object with initial welcome message
      const newThread: Thread = {
        id: response.id,
        name,
        messages: [{
          id: uuidv4(), // This will be replaced when we load the actual thread
          role: "bot",
          content: "Xin chào! Tôi là trợ lý AI của bạn. Rất vui được hỗ trợ bạn - Bạn cần tôi giúp gì hôm nay?",
          timestamp: new Date()
        }],
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        userId: user?.id?.toString() || "guest-user" // Get user ID from auth context
      };
      
      // Update local state
      setThreads(prevThreads => [newThread, ...prevThreads]);
      
      // Load the complete thread with messages
      await selectThread(newThread.id);
      
      return newThread.id;
    } catch (error) {
      console.error("Error creating thread:", error);
      throw error;
    }
  };

  const deleteThread = async (threadId: string) => {
    try {
      // Delete on API
      await chatApi.deleteThread(threadId);
      
      // Update local state
      setThreads(prevThreads => prevThreads.filter(thread => thread.id !== threadId));
      
      if (activeThreadId === threadId) {
        // Set the next thread as active, or null if no threads left
        const remainingThreads = threads.filter(t => t.id !== threadId);
        if (remainingThreads.length > 0) {
          await selectThread(remainingThreads[0].id);
        } else {
          setActiveThreadId(null);
        }
      }
    } catch (error) {
      console.error("Error deleting thread:", error);
      throw error;
    }
  };

  const sendMessage = async (content: string, role?: string) => {
    if (!activeThreadId || !content.trim() || isMessageLoading) return;

    // Create temporary user message for optimistic UI update
    const tempUserMessageId = uuidv4();
    const userMessage: Message = {
      id: tempUserMessageId,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
      apiRole: role // Include the role in the message
    };

    // Update the thread with the user message (optimistic update)
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

    setIsMessageLoading(true);

    try {
      // Use the chat API client to send the message
      const data = await chatApi.sendMessage(content.trim(), activeThreadId, role || 'default');
      
      // Create a bot message from the API response
      const botMessage: Message = {
        id: uuidv4(), // Will be replaced when we reload the thread
        role: "bot",
        content: data.explanation || "Sorry, I couldn't process your request.",
        timestamp: new Date(),
        suggestions: data.questionSuggestion,
        summary: data.summary,
        needClarify: data.need_clarify,
        inputType: data.input_type,
        sessionId: data.session_id // Store the session ID from the API
      };

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
      
      // Optionally, reload the thread to ensure consistency with the server
      // This step is not strictly necessary but ensures we have the server's message IDs
      await selectThread(activeThreadId);
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
      setIsMessageLoading(false);
    }
  };

  const selectThread = async (threadId: string) => {
    try {
      const threadData = await chatApi.getThread(threadId);
      
      // Process messages and update thread
      const messages = threadData.messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        apiRole: msg.apiRole,
        suggestions: msg.suggestions,
        summary: msg.summary,
        needClarify: msg.needClarify,
        inputType: msg.inputType
      }));
      
      // Update the thread with messages
      setThreads(prevThreads => 
        prevThreads.map(thread => 
          thread.id === threadId 
            ? { ...thread, messages } 
            : thread
        )
      );
      
      setActiveThreadId(threadId);
    } catch (error) {
      console.error("Error loading thread:", error);
    }
  };

  const renameThread = async (threadId: string, newName: string) => {
    if (!newName.trim()) return;

    try {
      // Update on API
      await chatApi.renameThread(threadId, newName.trim());
      
      // Update local state
      setThreads(prevThreads => 
        prevThreads.map(thread => 
          thread.id === threadId 
            ? { ...thread, name: newName.trim() }
            : thread
        )
      );
    } catch (error) {
      console.error("Error renaming thread:", error);
      throw error;
    }
  };

  // Function to send a suggested question as a new message
  const sendSuggestion = async (suggestion: string) => {
    if (suggestion.trim()) {
      await sendMessage(suggestion.trim());
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
      isLoading,
      isMessageLoading
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
