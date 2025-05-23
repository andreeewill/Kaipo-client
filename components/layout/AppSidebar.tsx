"use client";
import { useState } from "react";
import {
  Calendar,
  Home,
  // Inbox,
  Search,
  PersonStanding,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  useSidebar,
  Sidebar,
  // SidebarTrigger,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Jadwal Pasien",
    url: "/schedule",
    icon: Home,
  },
  {
    title: "Riwayat Pasien",
    url: "/dashboard/history",
    icon: Search,
  },
  {
    title: "Rekam Medis",
    url: "/dashboard/medical-record",
    icon: PersonStanding,
    subItems: [
      {
        title: "Detail Rekam Medis",
        url: "/dashboard/medical-record/detail",
        icon: FileText,
      },
      {
        title: "Riwayat Rekam Medis",
        url: "/dashboard/medical-record/history",
        icon: FileText,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open, toggleSidebar } = useSidebar();

  const [isSidebarOpen] = useState(true);

  const isActive = (url: string) => {
    const normalizedPathname = pathname.replace(/\/$/, "");
    const normalizedUrl = url.replace(/\/$/, "");
    return normalizedPathname === normalizedUrl;
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar className={isSidebarOpen ? "open" : "closed"}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              <Image
                src="/icon.jpg"
                width={100}
                height={50}
                alt="Halo dek"
              ></Image>
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    className={isActive(item.url) ? "active" : ""}
                  >
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                    {item.subItems && (
                      <SidebarMenuSub>
                        {item.subItems.map((subItem) => (
                          <SidebarMenuSubItem
                            key={subItem.title}
                            className={isActive(subItem.url) ? "active" : ""}
                          >
                            <SidebarMenuButton asChild>
                              <a href={subItem.url}>
                                <subItem.icon />
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>

            {/* <SidebarTrigger/> */}
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <button
        onClick={toggleSidebar}
        className="cursor-pointer hover:bg-gray-200 p-2 rounded-full"
        style={{
          position: "absolute",
          top: "10px",
          left: open ? "200px" : "10px",
          zIndex: 1000,
        }}
      >
        {open ? <ChevronLeft /> : <ChevronRight />}
      </button>
    </div>
  );
}
