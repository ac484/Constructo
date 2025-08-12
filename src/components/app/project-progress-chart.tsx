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

type ProgressData = {
    completed: number;
    inProgress: number;
    pending: number;
    totalValue: number;
}

const calculateValueProgress = (project: Project): ProgressData => {
  let completed = 0;
  let inProgress = 0;
  let pending = 0;

  const countTasks = (taskList: Task[]) => {
    for (const task of taskList) {
      if (task.status === 'Completed') completed += task.value;
      else if (task.status === 'In Progress') inProgress += task.value;
      else pending += task.value;
      
      // Since parent task value is the sum of its children, we don't need to recurse
      // if we are already iterating through all tasks flatly. But the structure is nested.
      if (task.subTasks.length > 0) {
        countTasks(task.subTasks);
      }
    }
  };
  
  // To avoid double counting, let's just use the main tasks if they have subtasks
  // or the subtasks if they exist. The model is a bit tricky.
  // The provided model: parent value should be sum of children. Let's assume that for now.
  // We should just iterate through all tasks and sum up their values based on status.
  const allTasks: Task[] = [];
  const flattenTasks = (tasks: Task[]) => {
    tasks.forEach(task => {
        allTasks.push(task);
        if (task.subTasks) {
            flattenTasks(task.subTasks);
        }
    })
  }
  flattenTasks(project.tasks);
  
  const progress = { completed: 0, inProgress: 0, pending: 0 };
  allTasks.forEach(task => {
      // We only count leaf nodes for progress calculation to avoid double counting value.
      if (task.subTasks.length === 0) {
          if (task.status === 'Completed') progress.completed += task.value;
          else if (task.status === 'In Progress') progress.inProgress += task.value;
          else progress.pending += task.value;
      }
  });


  return { ...progress, totalValue: project.value };
};

export function ProjectProgressChart({ project }: ProjectProgressChartProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const { completed, inProgress, pending, totalValue } = React.useMemo(
    () => calculateValueProgress(project),
    [project]
  );
  
  const completionPercentage = totalValue > 0 ? Math.round((completed / totalValue) * 100) : 0;

  const data = [
    { name: 'Completed', value: completed },
    { name: 'In Progress', value: inProgress },
    { name: 'Pending', value: pending },
  ].filter(item => item.value > 0);
  
  const totalTasks = project.tasks.reduce((acc, task) => acc + 1 + task.subTasks.length, 0);


  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{totalTasks} tasks, Total Value: {project.value}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="relative h-48 w-48">
          {isClient && (
            <PieChart width={192} height={192}>
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
                formatter={(value: number, name: string) => [`${value} value`, name]}
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
          )}
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
