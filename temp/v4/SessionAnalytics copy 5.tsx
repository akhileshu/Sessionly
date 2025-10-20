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
import {
  MarkdownViewer,
  type MarkdownViewerProps,
} from "../../src/components/app-model/MarkdownViewer";
import { getLog } from "../../src/components/app-model/getLog";
import { Tabs } from "../../src/components/shared/Tabs";

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

  console.log({ log: getLog(session) });

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
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Pie Chart */}
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-sm mb-2 font-medium">
                      Time Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={80}
                          label
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => `${v.toFixed(1)} min`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                      Total Duration: {totalDuration.toFixed(1)} min
                    </div>
                  </div>

                  {/* Bar Chart */}
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-sm mb-2 font-medium">
                      Task Duration (minutes)
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(v, n) => [`${v} min`, n]} />
                        <Legend />
                        <Bar dataKey="actual" fill="#3b82f6" />
                        <Bar dataKey="ideal" fill="#22c55e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Timeline Chart (Gantt-style) */}
                <div>
                  <h3 className="text-sm mb-2 font-medium">Timeline</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      layout="vertical"
                      data={timeline.map((d) => ({
                        task: d.title,
                        start: d.start.getTime() / 1000 / 60, // minutes
                        duration:
                          (d.end.getTime() - d.start.getTime()) / 1000 / 60,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" unit=" min" />
                      <YAxis type="category" dataKey="task" />
                      <Tooltip
                        formatter={(v) => `${v.toFixed(1)} min`}
                        labelFormatter={(label) => `Task: ${label}`}
                      />
                      <Bar dataKey="duration" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Line Chart (Cumulative Work) */}
                <div>
                  <h3 className="text-sm mb-2 font-medium">Cumulative Work</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="task" />
                      <YAxis unit=" min" />
                      <Tooltip formatter={(v) => `${v} min`} />
                      <Line
                        type="monotone"
                        dataKey="cumulativeWork"
                        stroke="#facc15"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="font-semibold text-green-500">Work</div>
                    <div>{workDuration.toFixed(1)} min</div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-500">Break</div>
                    <div>{breakDuration.toFixed(1)} min</div>
                  </div>
                  <div>
                    <div className="font-semibold text-yellow-500">Total</div>
                    <div>{totalDuration.toFixed(1)} min</div>
                  </div>
                </div>
                <div className="mt-6 text-xs text-muted-foreground text-center">
                  Session created{" "}
                  {formatDistanceToNow(new Date(session.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
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
