"use client";

import { Role, RolesResponse } from "@/types/role";
import { useState, useEffect } from "react";

// Function to fetch roles from the API
export async function fetchRoles(): Promise<RolesResponse> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/api/roles`);
    if (!response.ok) {
      throw new Error(`Error fetching roles: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    // Return a default empty response
    return {
      roles: [],
      default_role: "",
      timestamp: new Date().toISOString()
    };
  }
}

// Hook to manage roles
export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [defaultRole, setDefaultRole] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRoles() {
      try {
        setIsLoading(true);
        const data = await fetchRoles();
        setRoles(data.roles);
        setDefaultRole(data.default_role);
        // Set the selected role to the default role initially
        setSelectedRole(data.default_role);
        setError(null);
      } catch (err) {
        setError("Failed to load roles");
        console.error("Error loading roles:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadRoles();
  }, []);

  return {
    roles,
    defaultRole,
    selectedRole,
    setSelectedRole,
    isLoading,
    error
  };
}
