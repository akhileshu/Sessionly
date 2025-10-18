import { useEffect } from "react";
import "./App.css";
import SessionTracker from "./components/index.SessionTracker";
import { AppSidebar } from "./components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { ThemeProvider } from "./context/theme-provider";
import { useSessionStore } from "./context/useSessionStore";

function App() {
  const loadFromStorage = useSessionStore((s) => s.loadFromStorage);

  useEffect(() => loadFromStorage(), [loadFromStorage]);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={false}>
        <div className="flex h-[calc(100vh-2rem)] m-4 border rounded-md ">
          <main className="flex-1 overflow-y-auto">
            <AppSidebar />
            <div className="flex">
              <SidebarTrigger />
              <SessionTracker className="min-w-6xl" />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
