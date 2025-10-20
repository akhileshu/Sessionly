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
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getLog } from "../../src/components/app-model/getLog";

const COLORS = ["#22c55e", "#3b82f6", "#facc15"];

export const SessionAnalytics = () => {
  const { session } = useSessionStore();
  if (!session) return null;

  const log = getLog(session);

  const { pieData, barData, totalWork, totalBreak } = useMemo(() => {
    const workLogs = log.filter((l) => l.type === "work");
    const breakLogs = log.filter((l) => l.type === "break");

    const totalWork = workLogs.reduce(
      (sum, l) => sum + l.actualDurationSec / 60,
      0
    );
    const totalBreak = breakLogs.reduce(
      (sum, l) => sum + l.actualDurationSec / 60,
      0
    );

    const pieData = [
      { name: "Work", value: totalWork },
      { name: "Break", value: totalBreak },
    ];

    const barData = workLogs.map((l) => ({
      name: l.title || "Untitled",
      actual: +(l.actualDurationSec / 60).toFixed(2),
      ideal: +(l.idealDurationSec / 60).toFixed(2),
      variance: +(l.varianceSec / 60).toFixed(2),
    }));

    return { pieData, barData, totalWork, totalBreak };
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
              <Tooltip formatter={(v) => `${(v as number).toFixed(1)} min`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Total: {(totalWork + totalBreak).toFixed(1)} min
          </div>
        </div>

        {/* Bar Chart: Actual vs Ideal vs Variance */}
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-sm mb-2 font-medium">Task Duration (minutes)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => [`${v} min`]} />
              <Legend />
              <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
              <Bar dataKey="ideal" fill="#22c55e" name="Ideal" />
              <Bar dataKey="variance" fill="#facc15" name="Variance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
