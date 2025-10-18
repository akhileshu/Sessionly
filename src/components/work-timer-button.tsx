import { useSessionStore } from "@/context/useSessionStore";
import { Button } from "./Button";
import type { IconName } from "./icons";

export function WorkTimerButton() {
  const { handleStartPause, timer } = useSessionStore();
  const getButtonState = (): { icon: IconName; text: string } => {
    if (timer.currentTaskIndex === null)
      return { icon: "work", text: "Start Work" };

    if (timer.running) return { icon: "pause", text: "Pause" };

    return { icon: "play", text: "Resume" };
  };

  const { icon, text } = getButtonState();

  return (
    <Button icon={icon} onClick={handleStartPause} variant="primary">
      {text}
    </Button>
  );
}
