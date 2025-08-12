'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';
import type { Project, Task, TaskStatus } from '@/lib/types';
import { initialProjects } from '@/lib/data';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'tasks'>) => void;
  findProject: (projectId: string) => Project | undefined;
  updateTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => void;
  addTask: (projectId: string, parentTaskId: string | null, taskTitle: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const findProject = (projectId: string) => {
    return projects.find((p) => p.id === projectId);
  };

  const addProject = (project: Omit<Project, 'id' | 'tasks'>) => {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      tasks: [],
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const updateTaskStatus = (projectId: string, taskId: string, status: TaskStatus) => {
    const updateRecursive = (tasks: Task[]): Task[] => {
      return tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, status, lastUpdated: new Date().toISOString() };
        }
        if (task.subTasks.length > 0) {
          return { ...task, subTasks: updateRecursive(task.subTasks) };
        }
        return task;
      });
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, tasks: updateRecursive(p.tasks) } : p
      )
    );
  };
  
  const addTask = (projectId: string, parentTaskId: string | null, taskTitle: string) => {
    const newTask: Task = {
        id: `task-${Date.now()}`,
        title: taskTitle,
        status: 'Pending',
        lastUpdated: new Date().toISOString(),
        subTasks: [],
      };

    const addRecursive = (tasks: Task[]): Task[] => {
        if (parentTaskId === null) {
            return [...tasks, newTask];
        }
        return tasks.map(task => {
            if (task.id === parentTaskId) {
                return {...task, subTasks: [...task.subTasks, newTask]};
            }
            if (task.subTasks.length > 0) {
                return {...task, subTasks: addRecursive(task.subTasks)};
            }
            return task;
        });
    };

    setProjects(prev => prev.map(p => {
        if (p.id === projectId) {
            return {...p, tasks: addRecursive(p.tasks)};
        }
        return p;
    }))
  }

  return (
    <ProjectContext.Provider value={{ projects, addProject, findProject, updateTaskStatus, addTask }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
