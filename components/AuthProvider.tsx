"use client";

import { useEffect } from "react";
import useAuthStore from "@/app/store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check if JWT cookie exists on app load
    const checkAuth = async () => {
      try {
        // Try to make an authenticated request to verify the token
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.kaipo.my.id"
          }/auth/verify`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          // Authentication successful, this will trigger JWT decoding in the store
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch {
        // If there's an error (network, etc.), assume not authenticated
        setAuthenticated(false);
      }
    };

    checkAuth();
  }, [setAuthenticated]);

  return <>{children}</>;
}
