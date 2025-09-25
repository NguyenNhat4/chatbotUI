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

// API client for chat functionality
const chatApi = {
  // Thread management
  getThreads: async () => {
    const response = await api.get('/api/threads');
    return response.data;
  },
  
  getThread: async (threadId) => {
    const response = await api.get(`/api/threads/${threadId}`);
    return response.data;
  },
  
  createThread: async (name) => {
    const response = await api.post('/api/threads', { name });
    return response.data;
  },
  
  renameThread: async (threadId, name) => {
    const response = await api.put(`/api/threads/${threadId}/rename`, { name });
    return response.data;
  },
  
  deleteThread: async (threadId) => {
    await api.delete(`/api/threads/${threadId}`);
    return true;
  },
  
  // Chat functionality
  sendMessage: async (content, threadId, _role = ORTHODONTIST_ROLE) => {
    const response = await api.post('/api/chat', {
      message: content,
      role: ORTHODONTIST_ROLE,
      session_id: threadId,
    });
    return response.data;
  },
};

export default chatApi;
