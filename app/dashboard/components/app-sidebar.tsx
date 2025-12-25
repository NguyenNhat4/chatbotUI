"use client"

import { Calendar, Home, Inbox, Search, Settings, User2, ChevronUp, MessageCircleMore, Stethoscope, Bot, AudioWaveform, BookOpen, Command, Frame, Map, PieChart, Settings2, SquareTerminal } from "lucide-react"
import { useChat } from "@/lib/chat-context"
import { useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavThreads } from "@/app/dashboard/components/nav-threads";
import { NavUser } from "@/app/dashboard/components/nav-user";


// Menu items.
const items = [
  {
    title: "Trang chủ",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Đoạn chat mới",
    url: "/dashboard/new-chat",
    icon: MessageCircleMore,
    action: "new-chat"
  },
  {
    title: "Tìm kiếm đoạn chat",
    url: "/dashboard/search",
    icon: Search,
  },
  {
    title: "Cài đặt",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

// This is sample data.
const data = {
  user: {
    name: "Tôn Thất Tùng",
    email: "tungtt@example.com",
    avatar: "https://github.com/shadcn.png", // Using a placeholder image from GitHub
  },
  teams: [
    {
      name: "Nha sĩ",
      logo: "logo",
      plan: "Dentist",
    },
    {
      name: "Bác sĩ",
      logo: AudioWaveform,
      plan: "Dentist",
    },
    {
      name: "Bệnh nhân",
      logo: Command,
      plan: "Patient",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  threads: [
    {
      name: "Design Engineering",
      url: "#",
    },
    {
      name: "Sales & Marketing",
      url: "#",
    },
    {
      name: "Travel",
      url: "#",
    },
    
    
  ],
}



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Move the hook call to the top level of the component
  const { createThread } = useChat();
  const router = useRouter();

  // Handler function defined at the component level
  const handleNewChat = async (e: React.MouseEvent) => {
    e.preventDefault();
    const threadId = await createThread("Cuộc trò chuyện mới");
    router.push(`/dashboard/thread/${threadId}`);
  };
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-3 py-3 px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                  <span className="font-semibold text-base">MedChat AI</span>
                  <span className="text-xs text-muted-foreground">Medical Assistant</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader> 
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Điều hướng</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.action === 'new-chat' ? (
                      <a 
                        href={item.url} 
                        onClick={handleNewChat}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    ) : (
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavThreads />
        
      </SidebarContent>

      <SidebarFooter>
          <div className="flex justify-center items-center mt-2 text-xs text-sidebar-foreground/50 font-light italic group-data-[collapsible=icon]:hidden">
            <Bot className="h-4 w-4 mr-1" />
            <span>AI Medical Assistant</span>
          </div>
          <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}