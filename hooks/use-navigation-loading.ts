"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useNavigationWithLoading() {
  const router = useRouter();

  const navigate = useCallback((url: string) => {
    // Dispatch navigation start event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("navigationStart"));
    }
    router.push(url);
  }, [router]);

  return { navigate };
}
