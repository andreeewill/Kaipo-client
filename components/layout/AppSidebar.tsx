"use client";

import { useState, useEffect } from "react";
import {
  CircuitBoard,
  Calendar,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

// Menu items for the main navigation
const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: CircuitBoard,
  },
  {
    title: "Appointment", 
    url: "/appointment",
    icon: Calendar,
  },
  {
    title: "Medical Record",
    url: "/medical-record", 
    icon: Stethoscope,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);

  const isActive = (url: string) => {
    const normalizedPathname = pathname.replace(/\/$/, "");
    const normalizedUrl = url.replace(/\/$/, "");
    return normalizedPathname === normalizedUrl;
  };

  const handleNavigation = (url: string) => {
    router.push(url);
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // Set CSS custom property for sidebar width
  useEffect(() => {
    const root = document.documentElement;
    // Mobile: always 64px, Desktop: 64px collapsed, 256px expanded
    const width = window.innerWidth >= 768 ? (isExpanded ? '256px' : '64px') : '64px';
    root.style.setProperty('--sidebar-width', width);
  }, [isExpanded]);

  return (
    <>
      {/* Mobile Sidebar - Icons only, fixed position */}
      <div className="fixed left-0 top-0 z-50 h-full w-16 bg-white border-r border-gray-200 flex flex-col md:hidden">
        {/* Logo area */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <Image
            src="/icon.jpg"
            width={32}
            height={32}
            alt="Kaipo"
            className="rounded"
          />
        </div>

        {/* Navigation items */}
        <nav className="flex-1 pt-4">
          <ul className="space-y-2 px-2">
            {menuItems.map((item) => (
              <li key={item.title}>
                <button
                  onClick={() => handleNavigation(item.url)}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-gray-100 ${
                    isActive(item.url)
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  title={item.title}
                >
                  <item.icon size={20} />
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Desktop Sidebar - Expandable/Collapsible */}
      <div className={`fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out hidden md:flex flex-col ${
        isExpanded ? "w-64" : "w-16"
      }`}>
        {/* Header with logo and toggle */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className={`flex items-center transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
            <Image
              src="/icon.jpg"
              width={32}
              height={32}
              alt="Kaipo"
              className="rounded mr-3"
            />
            {isExpanded && (
              <span className="font-semibold text-gray-900">Kaipo</span>
            )}
          </div>
          
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 pt-6">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => (
              <li key={item.title}>
                <button
                  onClick={() => handleNavigation(item.url)}
                  className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-100 ${
                    isActive(item.url)
                      ? "bg-blue-100 text-blue-600 shadow-sm"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                  title={isExpanded ? undefined : item.title}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {isExpanded && (
                    <span className="ml-3 font-medium transition-opacity duration-300">
                      {item.title}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer or additional actions can go here */}
        <div className="p-4 border-t border-gray-200">
          {isExpanded ? (
            <div className="text-xs text-gray-500 text-center">
              © 2025 Kaipo
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
