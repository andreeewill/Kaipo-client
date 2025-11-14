"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Reset loading state when pathname or searchParams change
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything itself
}

// Global navigation loading component
export function NavigationLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Clear loading state when pathname changes
    setIsLoading(false);
  }, [pathname]);

  // Listen for custom navigation events
  useEffect(() => {
    const handleNavigationStart = () => setIsLoading(true);
    const handleNavigationEnd = () => setIsLoading(false);

    window.addEventListener("navigationStart", handleNavigationStart);
    window.addEventListener("navigationComplete", handleNavigationEnd);

    return () => {
      window.removeEventListener("navigationStart", handleNavigationStart);
      window.removeEventListener("navigationComplete", handleNavigationEnd);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-[#31572c]" />
        <p className="text-sm font-medium text-gray-700">Loading page...</p>
      </div>
    </div>
  );
}

// Alternative: Top loading bar component
export function TopLoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(false);
    setProgress(0);
  }, [pathname]);

  useEffect(() => {
    const handleNavigationStart = () => {
      setIsLoading(true);
      setProgress(10);
    };
    const handleNavigationEnd = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    };

    window.addEventListener("navigationStart", handleNavigationStart);
    window.addEventListener("navigationComplete", handleNavigationEnd);

    return () => {
      window.removeEventListener("navigationStart", handleNavigationStart);
      window.removeEventListener("navigationComplete", handleNavigationEnd);
    };
  }, []);

  useEffect(() => {
    if (isLoading && progress < 90) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.random() * 10;
          return Math.min(prev + increment, 90);
        });
      }, 200);

      return () => clearInterval(timer);
    }
  }, [isLoading, progress]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#31572c] via-[#4f772d] to-[#90a955] transition-all duration-200 ease-out shadow-lg"
        style={{
          width: `${progress}%`,
          transition: progress === 100 ? "width 200ms ease-out" : "width 200ms ease-in-out",
        }}
      />
    </div>
  );
}
