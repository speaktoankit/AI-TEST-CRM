import { useState } from 'react';
import { useTasksStore } from '../lib/store/tasks';
import { TasksHeader } from '../components/tasks/tasks-header';
import { TasksFilters } from '../components/tasks/tasks-filters';
import { TasksTable } from '../components/tasks/tasks-table';
import { ManageQueuesModal } from '../components/tasks/manage-queues-modal';
import type { Task } from '../lib/types';

export default function Tasks() {
  const {
    tasks,
    queues,
    selectedTasks,
    view,
    search,
    setView,
    setSearch,
    selectTask,
    addQueue,
    updateQueue,
    deleteQueue
  } = useTasksStore();

  const [showManageQueues, setShowManageQueues] = useState(false);

  const handleTaskClick = (task: Task) => {
    console.log('Task clicked:', task.id);
  };

  const handleSelectAll = () => {
    tasks.forEach(task => selectTask(task.id));
  };

  const handleCreateQueue = async (name: string) => {
    try {
      addQueue(name);
    } catch (error) {
      console.error('Failed to create queue:', error);
    }
  };

  const handleRenameQueue = async (id: string, name: string) => {
    try {
      updateQueue(id, name);
    } catch (error) {
      console.error('Failed to rename queue:', error);
    }
  };

  const handleDeleteQueue = async (id: string) => {
    try {
      deleteQueue(id);
    } catch (error) {
      console.error('Failed to delete queue:', error);
    }
  };

  return (
    <div className="space-y-6">
      <TasksHeader
        taskCount={tasks.length}
        onCreateTask={() => {}}
        onManageQueues={() => setShowManageQueues(true)}
        onImport={() => {}}
      />

      <TasksFilters
        view={view as string}
        onViewChange={(newView: string) => setView(newView as 'list' | 'board')}
        search={search}
        onSearchChange={setSearch}
        onMoreFilters={() => {}}
        onEditColumns={() => {}}
        onSaveView={() => {}}
        onStartTasks={() => {}}
      />

      <TasksTable
        tasks={tasks}
        selectedTasks={new Set(selectedTasks)}
        onTaskClick={handleTaskClick}
        onSelectTask={selectTask}
        onSelectAll={handleSelectAll}
      />

      {showManageQueues && (
        <ManageQueuesModal
          queues={queues}
          onClose={() => setShowManageQueues(false)}
          onCreateQueue={handleCreateQueue}
          onRenameQueue={handleRenameQueue}
          onDeleteQueue={handleDeleteQueue}
        />
      )}
    </div>
  );
}