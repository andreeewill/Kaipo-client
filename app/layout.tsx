import React from "react";
import "../styles/globals.css";
import { Toaster } from "@/components/ui/toast";
import { QueryProvider } from "@/lib/queries";
import { TopLoadingBar } from "@/components/LoadingSpinner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <QueryProvider>
          {/* <AuthProvider> */}
          <TopLoadingBar />
          {children}
          <Toaster />
          {/* </AuthProvider> */}
        </QueryProvider>
      </body>
    </html>
  );
}
