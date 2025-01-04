import { 
  Users, 
  DollarSign, 
  CheckSquare, 
  TrendingUp,
  Mail
} from 'lucide-react';

const stats = [
  {
    name: 'Total Contacts',
    value: '2,651',
    change: '+12.5%',
    icon: Users,
    trend: 'up'
  },
  {
    name: 'Active Deals',
    value: '$4.2M',
    change: '+15.3%',
    icon: DollarSign,
    trend: 'up'
  },
  {
    name: 'Open Tasks',
    value: '147',
    change: '-3.2%',
    icon: CheckSquare,
    trend: 'down'
  },
  {
    name: 'Emails Sent',
    value: '1,245',
    change: '+8.7%',
    icon: Mail,
    trend: 'up'
  }
];

const recentActivities = [
  {
    id: 1,
    type: 'deal',
    title: 'Enterprise Deal Closed',
    description: 'Closed $500K deal with TechCorp',
    time: '2 hours ago'
  },
  {
    id: 2,
    type: 'contact',
    title: 'New Contact Added',
    description: 'John Smith from InnovateX',
    time: '4 hours ago'
  },
  {
    id: 3,
    type: 'task',
    title: 'Follow-up Call',
    description: 'Schedule follow-up with Sarah',
    time: '6 hours ago'
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Add New Deal
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${
                  stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className={`w-4 h-4 mr-1 ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`} />
                <span className={`text-sm ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`p-2 rounded-full ${
                activity.type === 'deal' ? 'bg-green-100' :
                activity.type === 'contact' ? 'bg-blue-100' : 'bg-purple-100'
              }`}>
                {activity.type === 'deal' ? (
                  <DollarSign className="w-5 h-5 text-green-600" />
                ) : activity.type === 'contact' ? (
                  <Users className="w-5 h-5 text-blue-600" />
                ) : (
                  <CheckSquare className="w-5 h-5 text-purple-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.description}</p>
              </div>
              <span className="text-sm text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}