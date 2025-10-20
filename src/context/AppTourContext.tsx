"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { type CallBackProps, STATUS } from "react-joyride";
import { Button } from "../components/shared/Button";

interface AppTourContextValue {
  run: boolean;
  startTour: () => void;
  handleJoyrideCallback: (data: CallBackProps) => void;
}

const AppTourContext = createContext<AppTourContextValue | null>(null);

export const AppTourProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [run, setRun] = useState(false);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status } = data;

    // @ts-expect-error status
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      localStorage.setItem("app-tour-complete", "true");
      setRun(false);
    }
  }, []);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("app-tour-complete");
    if (!hasSeenTour) setRun(true);
  }, []);

  const startTour = useCallback(() => {
    localStorage.removeItem("app-tour-complete");
    setRun(true);
  }, []);

  return (
    <AppTourContext.Provider value={{ run, startTour, handleJoyrideCallback }}>
      {children}
    </AppTourContext.Provider>
  );
};

export const useAppTour = () => {
  const ctx = useContext(AppTourContext);
  if (!ctx) throw new Error("useAppTour must be used within AppTourProvider");
  return ctx;
};

export function StartTourButton() {
  const { startTour } = useAppTour();

  return (
    <Button onClick={startTour} variant="primary">
      Start App Tour
    </Button>
  );
}
