"use client";

import { useState } from "react";
import {
  CircuitBoard,
  Calendar,
  Notebook,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  CreditCard,
} from "lucide-react";

import {
  useSidebar,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AddRecordModalContent from "@/features/add-record/AddRecordModalContent"; // Import the modal content

import { usePathname } from "next/navigation";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: CircuitBoard,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Reservasi Pasien",
    url: "/appointment",
    icon: Notebook,
  },
  {
    title: "Rekam Medis",
    url: "/medical-record",
    icon: Stethoscope,
  },
  {
    title: "Pembayaran",
    url: "/payment",
    icon: CreditCard,
  },
  {
    title: "Laporan",
    url: "/report",
    icon: Notebook,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
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

            {/* "Tambah Jadwal Pertemuan" Button */}
            <div className="p-4">
              <Button
                className="cursor-pointer"
                onClick={() => setIsModalOpen(true)} // Open the modal
              >
                Tambah Jadwal Pertemuan
              </Button>
            </div>

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
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Modal for "Tambah Jadwal Pertemuan" */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Tambah Jadwal Pertemuan</DialogTitle>
          </DialogHeader>
          <AddRecordModalContent onClose={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>

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
