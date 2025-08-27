import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "./components/ThemeProvider";
import { ClientCookiesProvider } from "./components/ClientCookiesProvider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "RHM Chatbot",
  description: "A medical chatbot powered by HiAI Vietnam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClientCookiesProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ClientCookiesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
