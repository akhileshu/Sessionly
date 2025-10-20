import type { Session } from "@/context/useSessionStore";
export type LogItem = {
  type: "work" | "break";
  taskId?: string;
  title?: string;
  start: Date;
  end: Date;
  actualDurationSec: number;
  idealDurationSec: number;
  expectedStart?: Date;
  expectedEnd?: Date;
  varianceSec: number;
};

export function getLog(session: Session) {
  const log: LogItem[] = [];
  const blockSec = session.blockDurationMin * 60;
  const breakSec = session.breakDurationMin * 60;
  const tasks = session.tasks.map((t) => ({ ...t })); // shallow copy
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (!task.startTime || !task.endTime) continue;
    const start = new Date(task.startTime);
    const end = new Date(task.endTime);
    const actualDuration = (end.getTime() - start.getTime()) / 1000;
    const idealDuration = task.blocks * blockSec; // Add task entry
    log.push({
      taskId: task.id,
      title: task.title,
      type: "work",
      start,
      end,
      actualDurationSec: actualDuration,
      idealDurationSec: idealDuration,
      varianceSec: actualDuration - idealDuration,
    }); // Add break entry (except after last task)
    if (i < tasks.length - 1) {
      const nextTask = tasks[i + 1];
      const breakStart = end;
      if (!nextTask.startTime) continue;
      const breakEnd = new Date(nextTask.startTime);
      const breakDuration = (breakEnd.getTime() - breakStart.getTime()) / 1000;
      log.push({
        type: "break",
        start: breakStart,
        end: breakEnd,
        actualDurationSec: breakDuration,
        idealDurationSec: breakSec,
        varianceSec: actualDuration - idealDuration,
      });
    }
  }
  console.log({ log });

  return log;
}
