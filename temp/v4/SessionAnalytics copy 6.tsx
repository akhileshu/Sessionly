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
import { getLog } from "../../src/components/app-model/getLog";

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

function generateTimelineFromLog(log: any): ChartData[] {
  return log.map((entry: any) => ({
    taskId: entry.taskId || "break",
    title: entry.type === "work" ? entry.title : "Break",
    start: new Date(entry.start),
    end: new Date(entry.end),
    type: entry.type,
    idealDurationSec: entry.idealDurationSec,
    actualDurationSec: entry.actualDurationSec,
  }));
}

export const SessionAnalytics = () => {
  const { session } = useSessionStore();
  if (!session) return null;

  const log = getLog(session);

  const { pieData, barData, lineData, totalWork, totalBreak } = useMemo(() => {
    const timeline = generateTimelineFromLog(log);

    let totalWork = 0;
    let totalBreak = 0;

    const barData = timeline
      .filter((d) => d.type === "work")
      .map((d) => {
        const actualMin = d.actualDurationSec / 60;
        const idealMin = d.idealDurationSec / 60;
        totalWork += actualMin;
        totalBreak += Math.max(0, idealMin - actualMin);
        return {
          name: d.title,
          actual: +actualMin.toFixed(2),
          ideal: +idealMin.toFixed(2),
        };
      });

    let cumulative = 0;
    const lineData = timeline
      .filter((d) => d.type === "work")
      .map((d) => {
        cumulative += d.actualDurationSec / 60;
        return { task: d.title, cumulativeWork: +cumulative.toFixed(2) };
      });

    const pieData = [
      { name: "Work", value: totalWork },
      { name: "Break/Paused", value: totalBreak },
    ];

    return { pieData, barData, lineData, totalWork, totalBreak };
  }, [session, log]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Pie Chart: Work vs Break */}
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-sm mb-2 font-medium">Time Distribution</h3>
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
            Total: {(totalWork + totalBreak).toFixed(1)} min
          </div>
        </div>

        {/* Bar Chart: Actual vs Ideal per Task */}
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-sm mb-2 font-medium">Task Duration (minutes)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => [`${v} min`]} />
              <Legend />
              <Bar dataKey="actual" fill="#3b82f6" />
              <Bar dataKey="ideal" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart: Cumulative Work */}
      <div>
        <h3 className="text-sm mb-2 font-medium">Cumulative Work</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="task" />
            <YAxis unit=" min" />
            <Tooltip formatter={(v) => `${v} min`} />
            <Line type="monotone" dataKey="cumulativeWork" stroke="#facc15" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-center text-sm">
        <div>
          <div className="font-semibold text-green-500">Work</div>
          <div>{totalWork.toFixed(1)} min</div>
        </div>
        <div>
          <div className="font-semibold text-blue-500">Break</div>
          <div>{totalBreak.toFixed(1)} min</div>
        </div>
      </div>

      <div className="mt-6 text-xs text-muted-foreground text-center">
        Session created{" "}
        {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
      </div>
    </div>
  );
};
