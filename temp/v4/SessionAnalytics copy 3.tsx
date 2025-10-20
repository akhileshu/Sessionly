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
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
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

const COLORS = ["#22c55e", "#3b82f6", "#facc15", "#ef4444", "#8b5cf6"];

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
    const idealDuration =
      task.blocks * blockSec + Math.max(0, task.blocks - 1) * breakSec;

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

function generateTimelineData(session: any) {
  if (!session) return [];

  const timelineData = [];
  let currentTime = 0;

  session.tasks.forEach((task: any) => {
    if (!task.startTime || !task.endTime) return;

    const start = new Date(task.startTime);
    const end = new Date(task.endTime);
    const duration = (end.getTime() - start.getTime()) / 1000;

    // Add work segment
    timelineData.push({
      time: currentTime,
      task: task.title,
      type: "work",
      duration: duration / 60, // Convert to minutes
    });

    currentTime += duration / 60;

    // Add break segment if this isn't the last task
    const taskIndex = session.tasks.indexOf(task);
    if (taskIndex < session.tasks.length - 1) {
      const nextTask = session.tasks[taskIndex + 1];
      if (nextTask.startTime) {
        const nextStart = new Date(nextTask.startTime);
        const breakDuration = (nextStart.getTime() - end.getTime()) / 1000 / 60;

        if (breakDuration > 0) {
          timelineData.push({
            time: currentTime,
            task: "Break",
            type: "break",
            duration: breakDuration,
          });
          currentTime += breakDuration;
        }
      }
    }
  });

  return timelineData;
}

export const SessionAnalytics = ({
  MarkdownViewerProps,
}: {
  MarkdownViewerProps: MarkdownViewerProps;
}) => {
  const { session, timer } = useSessionStore();

  const {
    pieData,
    barData,
    timelineData,
    totalDuration,
    workDuration,
    breakDuration,
  } = useMemo(() => {
    if (!session)
      return {
        pieData: [],
        barData: [],
        timelineData: [],
        totalDuration: 0,
        workDuration: 0,
        breakDuration: 0,
      };

    const timeline = generateTimelineFromTasks(session);
    const timelineChartData = generateTimelineData(session);

    let totalWork = 0;
    let totalBreak = 0;

    // Fixed bar data calculation - no more negative values
    const barData = timeline.map((d) => {
      const actualMinutes = +(d.actualDurationSec / 60).toFixed(2);
      const idealMinutes = +(d.idealDurationSec / 60).toFixed(2);

      totalWork += d.actualDurationSec;

      // Calculate break/paused time properly
      const breakPausedTime = Math.max(0, actualMinutes - idealMinutes);
      totalBreak += breakPausedTime * 60; // Convert back to seconds for consistency

      return {
        name: d.title.length > 10 ? d.title.substring(0, 10) + "..." : d.title,
        actual: actualMinutes,
        ideal: idealMinutes,
        breakPaused: breakPausedTime,
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
      timelineData: timelineChartData,
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                              label={({ name, value }) =>
                                `${name}: ${(value / 60).toFixed(1)}m`
                              }
                            >
                              {pieData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number) => [
                                `${(value / 60).toFixed(1)} min`,
                                "Duration",
                              ]}
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
                            <Tooltip
                              formatter={(value: number, name: string) => [
                                `${value} min`,
                                name === "breakPaused" ? "Break/Paused" : name,
                              ]}
                            />
                            <Legend />
                            <Bar
                              dataKey="actual"
                              fill="#3b82f6"
                              name="Actual"
                            />
                            <Bar dataKey="ideal" fill="#22c55e" name="Ideal" />
                            <Bar
                              dataKey="breakPaused"
                              fill="#facc15"
                              name="Break/Paused"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Timeline Chart */}
                    <div className="mt-8">
                      <h3 className="text-sm mb-2 font-medium text-center">
                        Session Timeline
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={timelineData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="time"
                            label={{
                              value: "Time (minutes)",
                              position: "insideBottom",
                              offset: -5,
                            }}
                          />
                          <YAxis
                            label={{
                              value: "Duration (minutes)",
                              angle: -90,
                              position: "insideLeft",
                            }}
                          />
                          <Tooltip
                            formatter={(value: number, name: string) => [
                              `${value} min`,
                              name === "duration" ? "Duration" : name,
                            ]}
                            labelFormatter={(label) => `Time: ${label} min`}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="duration"
                            stroke="#8b5cf6"
                            name="Duration"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <ReferenceLine y={0} stroke="#666" />
                        </LineChart>
                      </ResponsiveContainer>
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
