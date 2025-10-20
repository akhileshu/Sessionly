"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSessionStore } from "@/context/useSessionStore";
import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

  const { pieData, barData, totalDuration, workDuration, breakDuration } =
    useMemo(() => {
      if (!session)
        return {
          pieData: [],
          barData: [],
          totalDuration: 0,
          workDuration: 0,
          breakDuration: 0,
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

      const pieData = [
        { name: "Work", value: totalWork },
        { name: "Break/Paused", value: totalBreak },
      ];

      const total = totalWork + totalBreak;

      return {
        pieData,
        barData,
        totalDuration: total,
        workDuration: totalWork,
        breakDuration: totalBreak,
      };
    }, [session, timer]);

  if (!session) return null;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Session Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="visualize"
            tabs={[
              {
                value: "visualize",
                label: "Visualize",
                content: (
                  <div>
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
                            <Tooltip
                              formatter={(v) => `${(v / 60).toFixed(1)} min`}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 text-center text-sm text-muted-foreground">
                          Total Duration: {(totalDuration / 60).toFixed(1)} min
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
                            <Bar dataKey="actual" fill="#3b82f6" />
                            <Bar dataKey="ideal" fill="#22c55e" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    {/* Stats */}
                    <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="font-semibold text-green-500">Work</div>
                        <div>{(workDuration / 60).toFixed(1)} min</div>
                      </div>
                      <div>
                        <div className="font-semibold text-blue-500">Break</div>
                        <div>{(breakDuration / 60).toFixed(1)} min</div>
                      </div>
                      <div>
                        <div className="font-semibold text-yellow-500">
                          Total
                        </div>
                        <div>{(totalDuration / 60).toFixed(1)} min</div>
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
        </CardContent>
      </Card>
    </div>
  );
};
