import type { Project } from './types';

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Downtown Office Tower',
    description:
      'Construction of a new 40-story office building in the city center. Includes foundation, structural work, facade, and interior finishing.',
    startDate: new Date('2023-01-15'),
    endDate: new Date('2025-06-30'),
    tasks: [
      {
        id: 'task-1-1',
        title: 'Foundation & Excavation',
        status: 'Completed',
        lastUpdated: new Date('2023-04-20T10:00:00Z').toISOString(),
        subTasks: [
          {
            id: 'task-1-1-1',
            title: 'Site Clearing',
            status: 'Completed',
            lastUpdated: new Date('2023-02-01T10:00:00Z').toISOString(),
            subTasks: [],
          },
          {
            id: 'task-1-1-2',
            title: 'Pouring Concrete',
            status: 'Completed',
            lastUpdated: new Date('2023-04-15T10:00:00Z').toISOString(),
            subTasks: [],
          },
        ],
      },
      {
        id: 'task-1-2',
        title: 'Structural Steel Erection',
        status: 'In Progress',
        lastUpdated: new Date().toISOString(),
        subTasks: [
          {
            id: 'task-1-2-1',
            title: 'Floors 1-10',
            status: 'Completed',
            lastUpdated: new Date('2023-08-01T10:00:00Z').toISOString(),
            subTasks: [],
          },
          {
            id: 'task-1-2-2',
            title: 'Floors 11-25',
            status: 'In Progress',
            lastUpdated: new Date().toISOString(),
            subTasks: [],
          },
          {
            id: 'task-1-2-3',
            title: 'Floors 26-40',
            status: 'Pending',
            lastUpdated: new Date('2023-05-01T10:00:00Z').toISOString(),
            subTasks: [],
          },
        ],
      },
      {
        id: 'task-1-3',
        title: 'Exterior Cladding & Glazing',
        status: 'Pending',
        lastUpdated: new Date('2023-05-01T10:00:00Z').toISOString(),
        subTasks: [],
      },
    ],
  },
  {
    id: 'proj-2',
    title: 'Bridge Expansion Project',
    description: 'Widening of the main city bridge to accommodate more traffic. Includes adding two new lanes and reinforcing the existing structure.',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2025-12-31'),
    tasks: [
        {
            id: 'task-2-1',
            title: 'Phase 1: Reinforcement',
            status: 'In Progress',
            lastUpdated: new Date().toISOString(),
            subTasks: [],
        },
        {
            id: 'task-2-2',
            title: 'Phase 2: New Lane Construction',
            status: 'Pending',
            lastUpdated: new Date('2024-03-01T10:00:00Z').toISOString(),
            subTasks: [],
        }
    ],
  },
];
