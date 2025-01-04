export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Queue {
  id: string;
  name: string;
  tasks: Task[];
  taskCount: number;
  created_at: string;
  updated_at: string;
}
