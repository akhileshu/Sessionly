import { useSessionStore } from "@/context/useSessionStore";
import { AppModal } from "../app-model/app-model";
import { getSessionMarkdown } from "../app-model/getSessionMarkdown";
import { Button } from "../shared/Button";
import { Pill } from "../shared/pill";
import { StartBreakButton } from "./StartBreakButton";
import { WorkTimerButton } from "./work-timer-button";

function Timer() {
  const { session, timer, handleStartPause } = useSessionStore();
  const allTasksDone = session
    ? session.tasks.every((task) => task.status === "done")
    : false;
  return (
    <div className="border p-2 rounded space-y-2 session-timer">
      <Pill>Timer</Pill>
      {allTasksDone ? (
        <p>allTasksDone</p>
      ) : (
        <>
          <div className="text-sm font-medium">
            Status: {timer.timerType === "work" ? "Work Time" : "Break Time"}
            {timer.timerType === "break" &&
              !timer.running &&
              " (Ready to Start)"}
          </div>

          <div className="space-x-2">
            {timer.timerType === "work" ? (
              // <Button icon={"MdOutlineWorkOutline"} onClick={handleStartPause} variant="primary">
              //   {timer.currentTaskIndex === null
              //     ? "Start Work"
              //     : timer.running
              //     ? "Pause"
              //     : "Resume"}
              // </Button>
              <WorkTimerButton />
            ) : (
              <>
                {!timer.running &&
                session &&
                timer.currentBlockRemainingSec ===
                  session.breakDurationMin * 60 ? (
                  <StartBreakButton />
                ) : (
                  <Button
                    icon="pause"
                    onClick={handleStartPause}
                    variant="primary"
                  >
                    {timer.running ? "Pause Break" : "Resume Break"}
                  </Button>
                )}
                {/* <Button onClick={handleStartWork} variant="primary">
                          Skip to Work
                        </Button> */}
              </>
            )}
          </div>

          <div className="text-sm">
            Current task:{" "}
            {timer.currentTaskIndex !== null
              ? session?.tasks[timer.currentTaskIndex]?.title
              : "—"}
          </div>
          <div className="text-2xl font-mono">
            {Math.floor(timer.currentBlockRemainingSec / 60)
              .toString()
              .padStart(2, "0")}
            :{(timer.currentBlockRemainingSec % 60).toString().padStart(2, "0")}
          </div>
        </>
      )}
      <AppModal
        showMdCopyButton={true}
        md={getSessionMarkdown(session)}
        className="min-w-3xl"
        trigger="Session Analytics"
        type="viewSessionAnalytics"
      />
    </div>
  );
}

export default Timer;
