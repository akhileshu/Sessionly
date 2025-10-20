import { useEffect } from "react";
import { HelmetComponent } from "@/components/HelmetProvider";
import "./App.css";
import AppTour from "./components/AppTour";
import SessionTracker from "./components/sessionTracker";
import { AppSidebar } from "./components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppTourProvider } from "./context/AppTourContext";
import { DeleteDialogProvider } from "./context/DeleteDialogContext";
import { ThemeProvider } from "./context/theme-provider";
import { useSessionStore } from "./context/useSessionStore";

function App() {
  const loadFromStorage = useSessionStore((s) => s.loadFromStorage);

  useEffect(() => loadFromStorage(), [loadFromStorage]);
  return (
    <>
      <HelmetComponent />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <DeleteDialogProvider>
          <AppTourProvider>
            <SidebarProvider defaultOpen={false}>
              <div className="flex h-[calc(100vh-2rem)] m-4 border rounded-md ">
                <main className="flex-1 overflow-y-auto">
                  <AppSidebar />
                  <div className="flex">
                    <SidebarTrigger className="sidebar-trigger-outside" />
                    <SessionTracker className="min-w-6xl" />
                  </div>
                  <AppTour />
                </main>
              </div>
            </SidebarProvider>
          </AppTourProvider>
        </DeleteDialogProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
