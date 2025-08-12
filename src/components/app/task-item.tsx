'use client';

import { useState } from 'react';
import type { Task, TaskStatus } from '@/lib/types';
import { useProjects } from '@/context/ProjectContext';
import {
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '../ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { AISubtaskSuggestions } from './ai-subtask-suggestions';

interface TaskItemProps {
  task: Task;
  projectId: string;
}

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  Pending: <Circle className="h-4 w-4 text-muted-foreground" />,
  'In Progress': <Clock className="h-4 w-4 text-yellow-500" />,
  Completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
};

const statusColors: Record<TaskStatus, string> = {
    Pending: 'border-muted-foreground/30',
    'In Progress': 'border-yellow-500/30',
    Completed: 'border-green-500/30',
};

export function TaskItem({ task, projectId }: TaskItemProps) {
  const { updateTaskStatus, addTask, findProject } = useProjects();
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const project = findProject(projectId);

  const handleStatusChange = (status: TaskStatus) => {
    updateTaskStatus(projectId, task.id, status);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (subtaskTitle.trim()) {
      addTask(projectId, task.id, subtaskTitle.trim());
      setSubtaskTitle('');
      setIsAddingSubtask(false);
      setIsOpen(true);
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
        <div
          className={cn(
            'flex items-center gap-2 rounded-lg border p-2 pl-3 bg-card',
            statusColors[task.status]
          )}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-6 w-6',
                task.subTasks.length === 0 && 'invisible'
              )}
            >
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  isOpen && 'rotate-90'
                )}
              />
            </Button>
          </CollapsibleTrigger>
          <span className="flex-grow font-medium">{task.title}</span>
          <Tooltip>
            <TooltipTrigger>
              <span className="text-xs text-muted-foreground mr-2">
                {formatDistanceToNow(new Date(task.lastUpdated), { addSuffix: true })}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Last updated: {new Date(task.lastUpdated).toLocaleString()}</p>
            </TooltipContent>
          </Tooltip>
          <Select value={task.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[150px] h-8">
              <SelectValue placeholder="Set status" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(statusIcons).map((status) => (
                <SelectItem key={status} value={status}>
                  <div className="flex items-center gap-2">
                    {statusIcons[status as TaskStatus]}
                    <span>{status}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowAISuggestions(true)}
              >
                <Sparkles className="h-4 w-4 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get AI Sub-task Suggestions</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsAddingSubtask(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Sub-task</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {showAISuggestions && project && (
            <AISubtaskSuggestions
                projectTitle={project.title}
                taskTitle={task.title}
                onAddSubtask={(title) => addTask(projectId, task.id, title)}
                onClose={() => setShowAISuggestions(false)}
            />
        )}

        <CollapsibleContent className="pl-6 space-y-2">
          {task.subTasks.map((subTask) => (
            <TaskItem key={subTask.id} task={subTask} projectId={projectId} />
          ))}

          {isAddingSubtask && (
            <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pl-8">
              <Input
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                placeholder="New sub-task title"
                className="h-8"
                autoFocus
              />
              <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">Add</Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingSubtask(false)}
              >
                Cancel
              </Button>
            </form>
          )}
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
  );
}
