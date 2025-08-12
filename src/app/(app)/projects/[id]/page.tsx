'use client';

import { useProjects } from '@/context/ProjectContext';
import { notFound, useParams } from 'next/navigation';
import { TaskItem } from '@/components/app/task-item';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import React from 'react';
import { Input } from '@/components/ui/input';

export default function ProjectDetailPage() {
  const params = useParams();
  const { findProject, addTask } = useProjects();
  const project = findProject(params.id as string);

  const [isAddingTask, setIsAddingTask] = React.useState(false);
  const [taskTitle, setTaskTitle] = React.useState('');

  if (!project) {
    // Let's not call notFound() immediately, data might still be loading
    // We can show a loading state instead.
    // For now, returning null is fine as the context handles loading state.
    return null;
  }
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if(taskTitle.trim()) {
        addTask(project.id, null, taskTitle.trim());
        setTaskTitle('');
        setIsAddingTask(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">{project.title}</CardTitle>
          <CardDescription className="text-base">{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-8 text-sm">
            <div>
              <span className="font-semibold">Start Date: </span>
              <span className="text-muted-foreground">{project.startDate ? format(project.startDate, 'MMMM dd, yyyy') : 'N/A'}</span>
            </div>
            <div>
              <span className="font-semibold">End Date: </span>
              <span className="text-muted-foreground">{project.endDate ? format(project.endDate, 'MMMM dd, yyyy') : 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>
              Manage all tasks and sub-tasks for this project.
            </CardDescription>
          </div>
          {!isAddingTask && (
            <Button variant="outline" onClick={() => setIsAddingTask(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
            {isAddingTask && (
                <form onSubmit={handleAddTask} className="flex items-center gap-2 p-2 rounded-lg border bg-secondary">
                    <Input 
                        placeholder="Enter new task title..." 
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        autoFocus
                    />
                    <Button type="submit" className="bg-primary hover:bg-primary/90">Add Task</Button>
                    <Button type="button" variant="ghost" onClick={() => setIsAddingTask(false)}>Cancel</Button>
                </form>
            )}

            {project.tasks.length > 0 ? (
                <div className="space-y-2">
                {project.tasks.map((task) => (
                    <TaskItem key={task.id} task={task} projectId={project.id} />
                ))}
                </div>
            ) : (
                !isAddingTask && (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-medium">No tasks yet</h3>
                        <p className="text-sm text-muted-foreground">Click "Add Task" to start planning.</p>
                    </div>
                )
            )}
        </CardContent>
      </Card>
    </div>
  );
}
