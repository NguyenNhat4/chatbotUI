import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Medical Chatbot",
  description: "A medical chatbot built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SidebarProvider>
          <AppSidebar />
            <AuthProvider>
              {children}
            </AuthProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
