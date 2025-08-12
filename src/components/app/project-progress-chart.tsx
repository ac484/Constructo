'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Project, Task } from '@/lib/types';

interface ProjectProgressChartProps {
  project: Project;
}

const COLORS = {
  Completed: 'hsl(var(--chart-1))',
  'In Progress': 'hsl(var(--chart-2))',
  Pending: 'hsl(var(--secondary))',
};

const calculateProgress = (tasks: Task[]) => {
  let completed = 0;
  let inProgress = 0;
  let pending = 0;
  let total = 0;

  const countTasks = (taskList: Task[]) => {
    for (const task of taskList) {
      total++;
      if (task.status === 'Completed') completed++;
      else if (task.status === 'In Progress') inProgress++;
      else pending++;

      if (task.subTasks.length > 0) {
        countTasks(task.subTasks);
      }
    }
  };

  countTasks(tasks);
  return { completed, inProgress, pending, total };
};

export function ProjectProgressChart({ project }: ProjectProgressChartProps) {
  const { completed, inProgress, pending, total } = React.useMemo(
    () => calculateProgress(project.tasks),
    [project.tasks]
  );
  
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const data = [
    { name: 'Completed', value: completed },
    { name: 'In Progress', value: inProgress },
    { name: 'Pending', value: pending },
  ].filter(item => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{total} tasks</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="relative h-48 w-48">
          <PieChart width={192} height={192}>
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              cornerRadius={8}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
              ))}
            </Pie>
          </PieChart>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-3xl font-bold text-foreground">{completionPercentage}%</span>
             <span className="text-sm text-muted-foreground">Complete</span>
          </div>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center text-sm">
              <span
                className="mr-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] }}
              ></span>
              <span>{entry.name} ({entry.value})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
