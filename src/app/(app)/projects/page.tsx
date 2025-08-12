'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { useProjects } from '@/context/ProjectContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CreateProjectDialog } from '@/components/app/create-project-dialog';

function calculateProgress(tasks: any[]): { completed: number, total: number } {
  let completed = 0;
  let total = 0;
  
  function recurse(taskArray: any[]) {
    taskArray.forEach(task => {
      total++;
      if (task.status === 'Completed') {
        completed++;
      }
      if (task.subTasks && task.subTasks.length > 0) {
        recurse(task.subTasks);
      }
    });
  }
  
  recurse(tasks);
  return { completed, total };
}

export default function ProjectsPage() {
  const { projects } = useProjects();

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage all your construction projects from one place.
          </p>
        </div>
        <CreateProjectDialog />
      </header>
      
      {projects.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">No Projects Yet</h2>
            <p className="text-muted-foreground mt-2">Click "New Project" to get started.</p>
        </div>
      ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const { completed, total } = calculateProgress(project.tasks);
          const progressPercentage = total > 0 ? (completed / total) * 100 : 0;
          
          return (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                         <span className="text-sm font-medium text-muted-foreground">Progress</span>
                         <span className="text-sm font-semibold">{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">{completed} of {total} tasks complete</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p><span className="font-medium text-foreground">Start:</span> {format(project.startDate, 'MMM dd, yyyy')}</p>
                  <p><span className="font-medium text-foreground">End:</span> {format(project.endDate, 'MMM dd, yyyy')}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href={`/projects/${project.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      )}
    </div>
  );
}
