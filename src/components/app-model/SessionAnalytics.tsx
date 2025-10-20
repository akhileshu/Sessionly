"use client";

import { useSessionStore, type Session } from "@/context/useSessionStore";
import { format, formatDistanceToNow } from "date-fns";
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
import { Tabs } from "../shared/Tabs";
import { getLog } from "./getLog";
import { MarkdownViewer, type MarkdownViewerProps } from "./MarkdownViewer";
("use client");

const COLORS = {
  work: "#22c55e",
  break: "#facc15",
};

export const SessionAnalytics = ({
  MarkdownViewerProps,
}: {
  MarkdownViewerProps: MarkdownViewerProps;
}) => {
  const { session } = useSessionStore();
  if (!session) return null;

  const log = getLog(session);

  const { pieData, barData, progressData, totalWork, totalBreak } =
    useMemo(() => {
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
        { name: "Work", value: Number(totalWork.toFixed(2)) },
        { name: "Break", value: Number(totalBreak.toFixed(2)) },
      ];

      const barData = workLogs.map((l) => ({
        name: l.title || "Untitled",
        actual: +(l.actualDurationSec / 60).toFixed(2),
        ideal: +(l.idealDurationSec / 60).toFixed(2),
        variance: +(l.varianceSec / 60).toFixed(2),
      }));

      const progressData = log.map((l) => ({
        time: format(l.end, "HH:mm:ss"),
        cumulative: l.cumulativeMin,
        type: l.type,
        label: l.label,
      }));

      return { pieData, barData, progressData, totalWork, totalBreak };
    }, [session, log]);

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="visualize"
        tabs={[
          {
            value: "visualize",
            label: "Visualize",
            content: (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-6">
                  {/* Pie Chart: Work vs Break */}
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-sm mb-2 font-medium">
                      Time Distribution
                    </h3>
                    <div className="w-full flex items-center">
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
                              fill={index === 0 ? COLORS.work : COLORS.break}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v) => `${(v as number).toFixed(1)} min`}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Summary */}
                    <div className="grid grid-cols-2 gap-4 text-center text-sm min-w-60">
                      <div>
                        <div className="font-semibold text-green-500">Work</div>
                        <div>{totalWork.toFixed(1)} min</div>
                      </div>
                      <div>
                        <div className="font-semibold text-yellow-500">
                          Break
                        </div>
                        <div>{totalBreak.toFixed(1)} min</div>
                      </div>
                    </div>
                    </div>
                  </div>

                  {/* Bar Chart: Task Duration */}
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-sm mb-2 font-medium">
                      Task Duration (minutes)
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(v) => [`${v} min`]} />
                        <Legend />
                        <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
                        <Bar dataKey="ideal" fill="#22c55e" name="Ideal" />
                        <Bar
                          dataKey="variance"
                          fill="#facc15"
                          name="Variance"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Continuous upward progress graph */}
                <div>
                  <h3 className="text-sm mb-2 font-medium text-center">
                    Session Progress (Cumulative Minutes)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis
                        label={{
                          value: "Total Minutes",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip
                        formatter={(v, _, d) => [`${v} min`, d.payload.label]}
                        labelFormatter={(v) => `At ${v}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="cumulative"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
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
                maxHeight
                showMdCopyButton={MarkdownViewerProps.showMdCopyButton}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export const sessionCreatedXAgo = (session: Session) => {
  return `Session created ${formatDistanceToNow(new Date(session.createdAt), {
    addSuffix: true,
  })}`;
};

