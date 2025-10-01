"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/app/store/authStore";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const code = searchParams.get("code");

      if (!code) {
        // No code found, redirect to login with error
        router.push("/login?error=google_failed");
        return;
      }

      try {
        const redirectUrl = encodeURIComponent(
          "http://localhost:3000/login/callback/success"
        );
        const response = await fetch(
          `https://api.kaipo.my.id/auth/google/code-exchange?code=${code}&redirect_url=${redirectUrl}`,
          {
            method: "GET",
            // credentials: "include", // Re-enable to receive cookies
          }
        );

        if (response.status === 204) {
          // Success - JWT cookie is set
          console.log("AUTH SUCCESS");
          
          // Wait a bit for cookie to be set, then update auth state
          setTimeout(() => {
            setAuthenticated(true);
            router.push("/dashboard");
          }, 100);
        } else {
          // Exchange failed
          router.push("/login?error=google_failed");
        }
      } catch (error) {
        // Network error
        router.push("/login?error=google_failed");
      }
    };

    handleGoogleCallback();
  }, [searchParams, router, setAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing your Google login...</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
