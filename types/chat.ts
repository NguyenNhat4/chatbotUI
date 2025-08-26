// Define types for our chat system
export interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
  apiRole?: string; // Optional field for the API role
  suggestions?: string[]; // Question suggestions from API
  summary?: string; // Summary from API
  needClarify?: boolean; // Whether clarification is needed
  inputType?: string; // Type of input (e.g., medical_question)
  sessionId?: string; // Session ID from the API
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
