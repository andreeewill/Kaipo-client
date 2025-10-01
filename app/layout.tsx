import React from "react";
import "../styles/globals.css";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/toast";
import { QueryProvider } from "@/lib/queries";

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
          {children}
          <Toaster />
          {/* </AuthProvider> */}
        </QueryProvider>
      </body>
    </html>
  );
}
