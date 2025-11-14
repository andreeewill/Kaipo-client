"use client";

import { AppSidebar } from "./AppSidebar";
import { TopLoadingBar } from "@/components/LoadingSpinner";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <TopLoadingBar />
      <AppSidebar />
      {/* Main content area with responsive padding that adjusts to sidebar */}
      <main className="flex-1 overflow-auto transition-all duration-300" style={{
        marginLeft: 'var(--sidebar-width, 64px)' // Default mobile width
      }}>
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
