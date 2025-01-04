import React from 'react';
import { Users, DollarSign, Mail, Calendar } from 'lucide-react';
import { useDashboardData } from '../../hooks/use-dashboard-data';
import { TodayTasks } from '../../components/dashboard/today-tasks';
import { EmailFollowups } from '../../components/dashboard/email-followups';
import { EmailActivity } from '../../components/dashboard/email-activity';

export default function Dashboard() {
  const {
    totalContacts,
    activeDeals,
    pendingTasks,
    todaysTasks,
    emailFollowups,
    emailThreads,
    upcomingEvents,
    isLoading,
    error
  } = useDashboardData();

  const handleCompleteTask = async (taskId: string) => {
    console.log('Complete task:', taskId);
  };

  const handleApproveEmail = async (suggestion: any) => {
    console.log('Approve email:', suggestion);
  };

  const handleDismissEmail = (suggestion: any) => {
    console.log('Dismiss email:', suggestion);
  };

  if (error) {
    return (
      <div className="text-red-500">
        Error loading dashboard data: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Contacts</p>
              <p className="text-2xl font-semibold text-gray-900">{totalContacts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Deals</p>
              <p className="text-2xl font-semibold text-gray-900">{activeDeals}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Mail className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unread Emails</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingEvents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Email Activity */}
        <div className="lg:col-span-2 space-y-6">
          <EmailActivity threads={emailThreads} />
          
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <p className="text-sm text-gray-500">No recent activity</p>
          </div>
          
          {/* AI Insights */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">AI Insights</h2>
            <p className="text-sm text-gray-500">No insights available</p>
          </div>
        </div>
        
        {/* Right Column - Tasks and Email Followups */}
        <div className="space-y-6">
          <TodayTasks
            tasks={todaysTasks}
            onComplete={handleCompleteTask}
          />
          <EmailFollowups
            suggestions={emailFollowups}
            onApprove={handleApproveEmail}
            onDismiss={handleDismissEmail}
          />
        </div>
      </div>
    </div>
  );
}