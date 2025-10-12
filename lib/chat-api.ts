/**
 * API client for the chat backend
 *
 * This module provides a client for the chat backend API,
 * allowing the frontend to interact with the chat API endpoints.
 */

import axios from 'axios';

// Base URL for the API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const ORTHODONTIST_ROLE = 'orthodontist';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No authentication token found');
  }
  return config;
});

// Types for API responses
export interface Thread {
  id: string;
  name: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Message {
  id: string;
  role: string;
  content: string;
  timestamp: string | Date;
  apiRole?: string;
  suggestions?: string[];
  summary?: string;
  needClarify?: boolean;
  inputType?: string;
}

export interface ThreadWithMessages extends Thread {
  messages: Message[];
}

export interface ChatResponse {
  explanation: string;
  questionSuggestion?: string[];
  summary?: string;
  need_clarify?: boolean;
  input_type?: string;
  session_id?: string;
}

// API client for chat functionality
const chatApi = {
  // Thread management
  getThreads: async (): Promise<Thread[]> => {
    const response = await api.get<Thread[]>('/api/threads');
    return response.data;
  },

  getThread: async (threadId: string): Promise<ThreadWithMessages> => {
    const response = await api.get<ThreadWithMessages>(`/api/threads/${threadId}`);
    return response.data;
  },

  createThread: async (name: string): Promise<Thread> => {
    const response = await api.post<Thread>('/api/threads', { name });
    return response.data;
  },

  renameThread: async (threadId: string, name: string): Promise<Thread> => {
    const response = await api.put<Thread>(`/api/threads/${threadId}/rename`, { name });
    return response.data;
  },

  deleteThread: async (threadId: string): Promise<boolean> => {
    await api.delete(`/api/threads/${threadId}`);
    return true;
  },

  // Chat functionality
  sendMessage: async (
    content: string,
    threadId: string,
    role: string = ORTHODONTIST_ROLE,
    deepResearch: boolean = false
  ): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/api/chat', {
      message: content,
      role: role,
      session_id: threadId,
      deep_research: deepResearch,
    });
    return response.data;
  },
};

export default chatApi;
