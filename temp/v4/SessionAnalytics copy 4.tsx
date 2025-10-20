"use client";
import { useSessionStore } from "@/context/useSessionStore";
import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tabs } from "../../src/components/shared/Tabs";
import { MarkdownViewer, type MarkdownViewerProps } from "../../src/components/app-model/MarkdownViewer";

const COLORS = ["#22c55e", "#3b82f6", "#facc15"];

type ChartData = {
  taskId: string;
  title: string;
  start: Date;
  end: Date;
  type: "work" | "break";
  idealDurationSec: number;
  actualDurationSec: number;
};

function generateTimelineFromTasks(session: any): ChartData[] {
  if (!session) return [];

  const data: ChartData[] = [];
  const blockSec = session.blockDurationMin * 60;
  const breakSec = session.breakDurationMin * 60;

  session.tasks.forEach((task: any) => {
    if (!task.startTime || !task.endTime) return;

    const start = new Date(task.startTime);
    const end = new Date(task.endTime);
    const actualDuration = (end.getTime() - start.getTime()) / 1000;
    const idealDuration = task.blocks * blockSec + (task.blocks - 1) * breakSec;

    data.push({
      taskId: task.id,
      title: task.title,
      start,
      end,
      type: "work",
      idealDurationSec: idealDuration,
      actualDurationSec: actualDuration,
    });
  });

  return data;
}

export const SessionAnalytics = ({
  MarkdownViewerProps,
}: {
  MarkdownViewerProps: MarkdownViewerProps;
}) => {
  const { session, timer } = useSessionStore();
  if (!session) return null;

  const log = [];
  const blockSec = session.blockDurationMin * 60;
  const breakSec = session.breakDurationMin * 60;

  const tasks = session.tasks.map((t) => ({ ...t })); // shallow copy

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (!task.startTime || !task.endTime) continue;

    const start = new Date(task.startTime);
    const end = new Date(task.endTime);
    const actualDuration = (end.getTime() - start.getTime()) / 1000;
    const idealDuration = task.blocks * blockSec;

    // Add task entry
    log.push({
      taskId: task.id,
      title: task.title,
      type: "work",
      start,
      end,
      actualDurationSec: actualDuration,
      idealDurationSec: idealDuration,
    });

    // Add break entry (except after last task)
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
        breakStart,
        breakEnd,
        idealDurationSec: breakSec,
      });
    }
  }

  console.log({ log });

  const {
    pieData,
    barData,
    totalDuration,
    workDuration,
    breakDuration,
    timeline,
    lineData,
  } = useMemo(() => {
    if (!session)
      return {
        pieData: [],
        barData: [],
        totalDuration: 0,
        workDuration: 0,
        breakDuration: 0,
        timeline: [],
        lineData: [],
      };

    const timeline = generateTimelineFromTasks(session);

    let totalWork = 0;
    let totalBreak = 0;

    const barData = timeline.map((d) => {
      const actualMin = d.actualDurationSec / 60;
      const idealMin = d.idealDurationSec / 60;
      const pausedOrBreakMin = Math.max(0, idealMin - actualMin);

      totalWork += actualMin;
      totalBreak += pausedOrBreakMin;

      return {
        name: d.title,
        actual: +actualMin.toFixed(2),
        ideal: +idealMin.toFixed(2),
      };
    });

    // Line chart cumulative work
    let cumulative = 0;
    const lineData = timeline.map((d) => {
      cumulative += d.actualDurationSec / 60;
      return {
        task: d.title,
        cumulativeWork: +cumulative.toFixed(2),
      };
    });

    const total = totalWork + totalBreak;

    const pieData = [
      { name: "Work", value: totalWork },
      { name: "Break/Paused", value: totalBreak },
    ];

    return {
      pieData,
      barData,
      totalDuration: total,
      workDuration: totalWork,
      breakDuration: totalBreak,
      timeline,
      lineData,
    };
  }, [session, timer]);

  if (!session) return null;

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="visualize"
        tabs={[
          {
            value: "visualize",
            label: "Visualize",
            content: (
              
            ),
          },
          {
            value: "markdown",
            label: "Markdown",
            content: (
              <MarkdownViewer
                md={MarkdownViewerProps.md}
                showMdCopyButton={MarkdownViewerProps.showMdCopyButton}
              />
            ),
          },
        ]}
      />
    </div>
  );
};
