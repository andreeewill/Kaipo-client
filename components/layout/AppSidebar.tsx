"use client";
import { useRouter } from "next/navigation";
import { Calendar, Home, Search, PersonStanding, FileText } from "lucide-react";

import {
  Sidebar,
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

import Image from "next/image";

const items = [
  {
    title: "Jadwal Pasien",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: Calendar,
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
        title: "Histori Rekam Medis",
        url: "/dashboard/medical-record/history",
        icon: FileText,
      },
    ],
  },
];

export function AppSidebar() {
  const router = useRouter();

  return (
    <Sidebar>
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
                  className={router.pathname === item.url ? "active" : ""}
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
                          className={
                            router.pathname === subItem.url ? "active" : ""
                          }
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
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
