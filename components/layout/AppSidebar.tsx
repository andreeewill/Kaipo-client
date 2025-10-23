"use client";

import { useState, useEffect } from "react";
import {
  CircuitBoard,
  Calendar,
  Stethoscope,
  Brain,
  Smile,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  ChevronDown,
  ChevronUp,
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
    title: "Pendaftaran",
    icon: Calendar,
    submenu: [
      {
        title: "Pendaftaran Online",
        url: "/appointment",
        icon: Calendar,
      },
      {
        title: "Atur Antrian",
        url: "/dashboard/appointment-management",
        icon: CalendarCheck,
      },
    ],
  },
  {
    title: "Medical Record",
    url: "/medical-record", 
    icon: Stethoscope,
  },
  {
    title: "Odontogram",
    url: "/odontogram",
    icon: Smile,
  },
  {
    title: "AI Diagnosis",
    url: "/dashboard/ai-diagnosis",
    icon: Brain,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState(new Set());

  const isActive = (url: string) => {
    const normalizedPathname = pathname.replace(/\/$/, "");
    const normalizedUrl = url.replace(/\/$/, "");
    return normalizedPathname === normalizedUrl;
  };

  const isMenuActive = (item) => {
    if (item.url) {
      return isActive(item.url);
    }
    if (item.submenu) {
      return item.submenu.some(subItem => isActive(subItem.url));
    }
    return false;
  };

  const toggleMenu = (menuTitle) => {
    const newExpandedMenus = new Set(expandedMenus);
    if (newExpandedMenus.has(menuTitle)) {
      newExpandedMenus.delete(menuTitle);
    } else {
      newExpandedMenus.add(menuTitle);
    }
    setExpandedMenus(newExpandedMenus);
  };

  const handleNavigation = (url: string) => {
    console.log("Navigating to:", url); // Debug log
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

  // Auto-expand menus that contain active items
  useEffect(() => {
    const newExpandedMenus = new Set();
    menuItems.forEach(item => {
      if (item.submenu && isMenuActive(item)) {
        newExpandedMenus.add(item.title);
      }
    });
    
    // Only update if there's actually a change
    const currentExpandedArray = Array.from(expandedMenus).sort();
    const newExpandedArray = Array.from(newExpandedMenus).sort();
    
    if (JSON.stringify(currentExpandedArray) !== JSON.stringify(newExpandedArray)) {
      setExpandedMenus(newExpandedMenus);
    }
  }, [pathname]); // Only depend on pathname

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
                {item.submenu ? (
                  // Menu with submenu - just show main icon on mobile
                  <button
                    onClick={() => {
                      // For mobile, navigate to first submenu item if available
                      if (item.submenu && item.submenu.length > 0) {
                        handleNavigation(item.submenu[0].url);
                      }
                    }}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-gray-100 ${
                      isMenuActive(item)
                        ? "bg-[#ecf39e] text-[#132a13]"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    title={item.title}
                  >
                    <item.icon size={20} />
                  </button>
                ) : (
                  // Regular menu item
                  <button
                    onClick={() => handleNavigation(item.url)}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-gray-100 ${
                      isActive(item.url)
                        ? "bg-[#ecf39e] text-[#132a13]"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    title={item.title}
                  >
                    <item.icon size={20} />
                  </button>
                )}
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
                {item.submenu ? (
                  // Menu with submenu
                  <div>
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-100 ${
                        isMenuActive(item)
                          ? "bg-[#ecf39e] text-[#132a13] shadow-sm"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                      title={isExpanded ? undefined : item.title}
                    >
                      <div className="flex items-center">
                        <item.icon size={20} className="flex-shrink-0" />
                        {isExpanded && (
                          <span className="ml-3 font-medium transition-opacity duration-300">
                            {item.title}
                          </span>
                        )}
                      </div>
                      {isExpanded && (
                        <div className="flex-shrink-0">
                          {expandedMenus.has(item.title) ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </div>
                      )}
                    </button>
                    
                    {/* Submenu */}
                    {isExpanded && expandedMenus.has(item.title) && (
                      <ul className="mt-2 ml-6 space-y-1">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.title}>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleNavigation(subItem.url);
                              }}
                              className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-100 text-sm ${
                                isActive(subItem.url)
                                  ? "bg-[#31572c] text-[#ecf39e] shadow-sm"
                                  : "text-gray-600 hover:text-gray-900"
                              }`}
                            >
                              <subItem.icon size={16} className="flex-shrink-0" />
                              <span className="ml-2 transition-opacity duration-300">
                                {subItem.title}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  // Regular menu item
                  <button
                    onClick={() => handleNavigation(item.url)}
                    className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-100 ${
                      isActive(item.url)
                        ? "bg-[#ecf39e] text-[#132a13] shadow-sm"
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
                )}
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
