"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/app/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Removed ToastState interface as we're using Sonner now

function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Development toggle - set to true to bypass actual authentication
  const [devMode, setDevMode] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check for Google OAuth error
    const error = searchParams.get("error");
    if (error === "google_failed") {
      toast.error("Google login failed. Please try again.");
    }
  }, [searchParams]);

  // Set dev_mode cookie whenever devMode changes
  useEffect(() => {
    document.cookie = `dev_mode=${devMode}; path=/; max-age=${
      60 * 60 * 24 * 30
    }`; // 30 days
  }, [devMode]);

  const handleBasicLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // In development mode, bypass actual authentication
    console.log("🚀 ~ handleBasicLogin ~ devMode:", devMode);
    if (devMode) {
      // Set dev_mode cookie for middleware
      document.cookie = `dev_mode=true; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days

      // Simulate a short delay for better UX
      setTimeout(() => {
        setAuthenticated(true);
        toast.success("Development mode: Login successful");
        router.push("/dashboard");
        setIsLoading(false);
      }, 500);
      return;
    } else {
      // Clear dev_mode cookie when not in dev mode
      document.cookie = `dev_mode=false; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
    }

    // Real authentication flow for production
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "https://apiuat.kaipo.my.id"
        }/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include", // Important for cookies
        }
      );

      if (response.status === 204) {
        // Success - JWT cookie is set
        console.log("LOGIN SUCCESS");

        // Wait a bit for cookie to be set, then update auth state
        setTimeout(() => {
          setAuthenticated(true);
          router.push("/dashboard");
        }, 100);
      } else {
        // Login failed
        toast.error("Invalid email or password. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const redirectUrl = encodeURIComponent(
      "http://localhost:3000/login/callback/success"
    );
    window.location.href = `https://api.kaipo.my.id/auth/google/login?redirect_url=${redirectUrl}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back to Kaipo
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form className="space-y-6" onSubmit={handleBasicLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              {/* Development mode toggle */}
              <div className="flex items-center justify-between text-sm">
                <label
                  htmlFor="devMode"
                  className="flex items-center text-gray-700"
                >
                  <input
                    id="devMode"
                    type="checkbox"
                    checked={devMode}
                    onChange={(e) => setDevMode(e.target.checked)}
                    className="h-4 w-4 mr-2 rounded text-blue-600"
                  />
                  Development Mode
                </label>
                {devMode && (
                  <span className="text-green-600 text-xs">
                    Authentication bypassed - any credentials will work
                  </span>
                )}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div>
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </div>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
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
      <LoginPageContent />
    </Suspense>
  );
}
