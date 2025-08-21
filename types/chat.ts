// Define types for our chat system
export interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export interface Thread {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  userId: string; // To associate the thread with a specific user
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
