"use client";
 
import { useState, useEffect } from "react";
 
export function ClientCookiesProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
 
  useEffect(() => {
    setIsClient(true);
  }, []);
 
  // If we're not in the browser yet, render nothing
  if (!isClient) {
    return null;
  }
 
  return <>{children}</>;
}
