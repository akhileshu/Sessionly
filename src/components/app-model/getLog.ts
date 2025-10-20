import type { Session } from "@/context/useSessionStore";

export type LogItem = {
  type: "work" | "break";
  taskId?: string;
  title?: string;
  start: Date;
  end: Date;
  actualDurationSec: number;
  idealDurationSec: number;
  varianceSec: number;
  cumulativeMin: number; // total elapsed minutes till end of this log
  label: string;
};

export function getLog(session: Session): LogItem[] {
  const log: LogItem[] = [];
  const blockSec = session.blockDurationMin * 60;
  const breakSec = session.breakDurationMin * 60;
  const tasks = session.tasks.map((t) => ({ ...t }));

  let cumulativeSec = 0;

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (!task.startTime || !task.endTime) continue;

    const start = new Date(task.startTime);
    const end = new Date(task.endTime);
    const actualDurationSec = (end.getTime() - start.getTime()) / 1000;
    const idealDurationSec = task.blocks * blockSec;

    cumulativeSec += actualDurationSec;
    log.push({
      type: "work",
      taskId: task.id,
      title: task.title,
      start,
      end,
      actualDurationSec,
      idealDurationSec,
      varianceSec: actualDurationSec - idealDurationSec,
      cumulativeMin: +(cumulativeSec / 60).toFixed(2),
      label: task.title || "Work",
    });

    if (i < tasks.length - 1) {
      const nextTask = tasks[i + 1];
      if (!nextTask.startTime) continue;

      const breakStart = end;
      const breakEnd = new Date(nextTask.startTime);
      const breakSecActual = (breakEnd.getTime() - breakStart.getTime()) / 1000;
      cumulativeSec += breakSecActual;

      log.push({
        type: "break",
        start: breakStart,
        end: breakEnd,
        actualDurationSec: breakSecActual,
        idealDurationSec: breakSec,
        varianceSec: breakSecActual - breakSec,
        cumulativeMin: +(cumulativeSec / 60).toFixed(2),
        label: "Break",
      });
    }
  }

  console.log({ log });

//   return [
//     {
//       type: "work",
//       taskId: "t_1il79xa",
//       title: "Read React docs",
//       start: new Date("2025-10-20T13:00:00.000Z"),
//       end: new Date("2025-10-20T13:25:00.000Z"),
//       actualDurationSec: 1500, // 25 min
//       idealDurationSec: 1500,
//       varianceSec: 0,
//       cumulativeMin: 25.0,
//       label: "Read React docs",
//     },
//     {
//       type: "break",
//       start: new Date("2025-10-20T13:25:00.000Z"),
//       end: new Date("2025-10-20T13:30:00.000Z"),
//       actualDurationSec: 300, // 5 min
//       idealDurationSec: 300,
//       varianceSec: 0,
//       cumulativeMin: 30.0,
//       label: "Break",
//     },
//     {
//       type: "work",
//       taskId: "t_yoo7k1u",
//       title: "Implement table",
//       start: new Date("2025-10-20T13:30:00.000Z"),
//       end: new Date("2025-10-20T13:55:00.000Z"),
//       actualDurationSec: 1500, // 25 min
//       idealDurationSec: 1500,
//       varianceSec: 0,
//       cumulativeMin: 55.0,
//       label: "Implement table",
//     },
//     {
//       type: "break",
//       start: new Date("2025-10-20T13:55:00.000Z"),
//       end: new Date("2025-10-20T14:00:00.000Z"),
//       actualDurationSec: 300, // 5 min
//       idealDurationSec: 300,
//       varianceSec: 0,
//       cumulativeMin: 60.0,
//       label: "Break",
//     },
//     {
//       type: "work",
//       taskId: "t_5kl42pp",
//       title: "Refactor components",
//       start: new Date("2025-10-20T14:00:00.000Z"),
//       end: new Date("2025-10-20T14:30:00.000Z"),
//       actualDurationSec: 1800, // 30 min (overtime)
//       idealDurationSec: 1500,
//       varianceSec: 300,
//       cumulativeMin: 90.0,
//       label: "Refactor components",
//     },
//   ];

  return log;


}
