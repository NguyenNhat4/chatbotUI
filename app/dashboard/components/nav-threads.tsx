"use client"

import {
  Edit,
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
} from "lucide-react"
import { format } from "date-fns"
import { useChat } from "@/lib/chat-context"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavThreads() {
  const { isMobile } = useSidebar();
  const { threads, selectThread, deleteThread, renameThread, activeThreadId, createThread } = useChat();
  
  // Function to handle sharing thread
  const handleShareThread = (threadId: string) => {
    // In a real app, implement sharing functionality
    // For now, we'll just copy a mock URL to clipboard
    const shareUrl = `${window.location.origin}/share/${threadId}`;
    navigator.clipboard.writeText(shareUrl);
    alert(`Link đã được sao chép: ${shareUrl}`);
  };
  
  // Function to handle rename thread
  const handleRenameThread = (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return;
    
    const newName = window.prompt("Nhập tên mới cho đoạn chat:", thread.name);
    if (newName && newName.trim() !== "" && newName !== thread.name) {
      renameThread(threadId, newName);
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Đoạn Chat</SidebarGroupLabel>
      <SidebarMenu>
        {threads.map((thread) => (
          <SidebarMenuItem key={thread.id}>
            <SidebarMenuButton 
              asChild 
              isActive={activeThreadId === thread.id}
            >
              <a href={`/dashboard/thread/${thread.id}`} onClick={(e) => {
                e.preventDefault();
                selectThread(thread.id);
              }}>
                <span className="truncate">{thread.name}</span>
                <span className="text-xs text-sidebar-foreground/70 ml-auto">
                  {(() => {
                    try {
                      if (!thread.updatedAt) return '';
                      const date = thread.updatedAt instanceof Date 
                        ? thread.updatedAt 
                        : new Date(thread.updatedAt);
                      return isNaN(date.getTime()) ? '' : format(date, 'dd/MM');
                    } catch (error) {
                      console.warn('Error formatting date for thread:', thread.id, error);
                      return '';
                    }
                  })()}
                </span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">Thêm</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem onClick={() => handleRenameThread(thread.id)}>
                  <Edit className="text-muted-foreground" />
                  <span>Đổi tên đoạn chat</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => selectThread(thread.id)}>
                  <Folder className="text-muted-foreground" />
                  <span>Xem đoạn chat</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShareThread(thread.id)}>
                  <Forward className="text-muted-foreground" />
                  <span>Chia sẻ đoạn chat</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => deleteThread(thread.id)}>
                  <Trash2 className="text-muted-foreground" />
                  <span>Xoá đoạn chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton 
            className="text-sidebar-foreground/70"
            onClick={() => createThread("Cuộc trò chuyện mới")}
          >
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>Xem thêm</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}