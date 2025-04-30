import { AppSidebar } from "./AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex" }}>
      <SidebarProvider>
        <AppSidebar />
        <main className="p-10 pl-16">{children}</main>
      </SidebarProvider>
    </div>
  );
}
