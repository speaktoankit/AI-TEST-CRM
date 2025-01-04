import React from 'react';
import { Bot, ArrowRight } from 'lucide-react';
import type { AIInsight } from '../../../lib/types';

interface AIInsightsProps {
  insights: AIInsight[];
  isLoading: boolean;
}

export function AIInsights({ insights, isLoading }: AIInsightsProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-lg font-medium text-gray-900">AI Insights</h2>
      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex animate-pulse space-x-4">
                <div className="h-10 w-10 rounded bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-start space-x-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex-shrink-0">
                  <Bot className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{insight.type}</p>
                  <p className="mt-1 text-sm text-gray-500">{insight.content}</p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full bg-indigo-50 p-2 text-indigo-600 hover:bg-indigo-100"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Bot className="h-6 w-6 text-indigo-600" />
            <p className="text-sm text-gray-500">No insights available</p>
          </div>
        )}
      </div>
    </div>
  );
}