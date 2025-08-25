"use client"

import { Calendar, Home, Inbox, Search, Settings, User2, ChevronUp, MessageCircleMore } from "lucide-react"
import { useChat } from "@/lib/chat-context"
import Image from "next/image"
import LogoKhoaRHM from "@/assets/logo-khoa-rhm.png"

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

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"


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

  // Handler function defined at the component level
  const handleNewChat = (e: React.MouseEvent) => {
    e.preventDefault();
    createThread("Cuộc trò chuyện mới");
  };
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image src={LogoKhoaRHM} alt="Logo Khoa RHM" className="size-8" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">ĐH Y Dược</span>
                  <span className="">Khoa Răng Hàm Mặt</span>
                </div>
              </a>
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
          <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}