import type { Session } from "@/context/useSessionStore";
export type LogItem =
  | {
      type: "work";
      taskId: string;
      title: string;
      start: Date;
      end: Date;
      expectedStart: Date;
      expectedEnd: Date;
      actualDurationSec: number;
      idealDurationSec: number;
      varianceSec: number;
      project?: string;
      category?: string;
      tags?: string[];
      status?: "pending" | "done";
      notesBefore?: string;
      notesAfter?: string;
      taskSequence: number;
      overdue: boolean;
      blocksCompleted: number;
      completionPercentage: number;
    }
  | {
      type: "break";
      start: Date;
      end: Date;
      breakStart: Date;
      breakEnd: Date;
      actualDurationSec: number;
      idealDurationSec: number;
      breakVarianceSec: number;
      isSkipped: boolean;
      breakType: "auto" | "manual";
      taskSequence: number;
    };
export function getLog(session: Session) {
  const log: LogItem[] = [];
  const blockSec = session.blockDurationMin * 60;
  const breakSec = session.breakDurationMin * 60;

  const tasks = session.tasks.map((t) => ({ ...t })); // shallow copy

  let lastEndTime: Date | null = null;

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (!task.startTime || !task.endTime) continue;

    const start = new Date(task.startTime);
    const end = new Date(task.endTime);
    const actualDuration = (end.getTime() - start.getTime()) / 1000;
    const idealDuration = task.blocks * blockSec;
    const expectedStart = lastEndTime ? lastEndTime : start;
    const expectedEnd = new Date(
      expectedStart.getTime() + idealDuration * 1000
    );
    const varianceSec = actualDuration - idealDuration;

    // Add task entry
    log.push({
      taskId: task.id,
      title: task.title,
      type: "work",
      start,
      end,
      expectedStart,
      expectedEnd,
      actualDurationSec: actualDuration,
      idealDurationSec: idealDuration,
      varianceSec,
      project: session.project,
      category: session.category,
      tags: task.tags || [],
      status: task.status,
      notesBefore: task.notesBefore || "",
      notesAfter: task.notesAfter || "",
      taskSequence: i + 1,
      overdue: actualDuration > idealDuration,
      blocksCompleted: task.blocks,
      completionPercentage: Math.min(
        (actualDuration / idealDuration) * 100,
        100
      ),
    });

    lastEndTime = end;

    // Add break entry (except after last task)
    if (i < tasks.length - 1) {
      const nextTask = tasks[i + 1];
      if (!nextTask.startTime) continue;

      const breakStart = end;
      const breakEnd = new Date(nextTask.startTime);
      const breakDuration = (breakEnd.getTime() - breakStart.getTime()) / 1000;
      const breakVarianceSec = breakDuration - breakSec;

      log.push({
        type: "break",
        start: breakStart,
        end: breakEnd,
        breakStart,
        breakEnd,
        actualDurationSec: breakDuration,
        idealDurationSec: breakSec,
        breakVarianceSec,
        isSkipped: breakDuration === 0,
        breakType: "auto",
        taskSequence: i + 1,
      });

      lastEndTime = breakEnd;
    }
  }

  console.log({log})

  return log;
}
