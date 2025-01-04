import { useState, useEffect } from 'react';
import {
  getContactsCount,
  getActiveDealsCount,
  getPendingTasksCount,
  getTodaysTasks,
  getRecentEmailThreads,
  getEmailSuggestions
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import type { Task, EmailSuggestion, EmailThread, Activity, AIInsight } from '../lib/types';

interface DashboardData {
  totalContacts: number;
  activeDeals: number;
  pendingTasks: number;
  todaysTasks: Task[];
  emailFollowups: EmailSuggestion[];
  emailThreads: EmailThread[];
  upcomingEvents: number;
  recentActivities: Activity[];
  aiInsights: AIInsight[];
  isLoading: boolean;
  error: Error | null;
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    totalContacts: 0,
        // Get contacts count
        const contactsSnapshot = await getDocs(collection(db, 'contacts'));
        const contactsCount = contactsSnapshot.size;

        // Get active deals count
        const dealsQuery = query(
          collection(db, 'deals'),
          where('stage', 'in', ['proposal', 'negotiation'])
        );
        const dealsSnapshot = await getDocs(dealsQuery);
        const dealsCount = dealsSnapshot.size;

        // Get pending tasks
        const tasksQuery = query(
          collection(db, 'tasks'),
          where('status', '==', 'pending')
        );
        const tasksSnapshot = await getDocs(tasksQuery);
        const tasksCount = tasksSnapshot.size;

        // Get recent activities
        const activitiesQuery = query(
          collection(db, 'activities'),
          orderBy('created_at', 'desc'),
          limit(5)
        );
        const activitiesSnapshot = await getDocs(activitiesQuery);
        const activities = activitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Get AI insights
        const insightsQuery = query(
          collection(db, 'aiInsights'),
          where('status', '==', 'pending'),
          orderBy('created_at', 'desc'),
          limit(5)
        );
        const insightsSnapshot = await getDocs(insightsQuery);
        const insights = insightsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setData({
          totalContacts: contacts,
          activeDeals: deals,
          pendingTasks: tasks,
          todaysTasks,
          emailFollowups: emailSuggestions,
          emailThreads,
          upcomingEvents: 0,
          recentActivities: [],
          aiInsights: [],
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: error as Error,
        }));
      }
    }

    fetchDashboardData();
  }, []);

  return data;
}