import { useEffect } from "react";
import "./App.css";
import SessionTracker from "./components/index.SessionTracker";
import { useSessionStore } from "./context/useSessionStore";
import { AppLayout } from "./layouts/AppLayout";

function App() {
  const loadFromStorage = useSessionStore((s) => s.loadFromStorage);

  useEffect(() => loadFromStorage(), [loadFromStorage]);
  return (
    <div>
      <AppLayout>
        <SessionTracker />
      </AppLayout>
    </div>
  );
}

export default App;
