import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Settings, 
  MapPin, 
  Clock,
  AlertTriangle,
  Activity
} from 'lucide-react'

const Sidebar: React.FC = () => {
  const location = useLocation()

  const menuItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Real-time overview'
    },
    {
      path: '/analytics',
      label: 'Analytics',
      icon: TrendingUp,
      description: 'Historical analysis'
    },
    {
      path: '/predictions',
      label: 'ML Predictions',
      icon: Brain,
      description: 'AI-powered forecasts'
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: Settings,
      description: 'System configuration'
    }
  ]

  const quickStats = [
    {
      label: 'Active Sensors',
      value: '24',
      icon: MapPin,
      color: 'text-green-600'
    },
    {
      label: 'Avg Response',
      value: '1.2s',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      label: 'Alerts Today',
      value: '3',
      icon: AlertTriangle,
      color: 'text-orange-600'
    },
    {
      label: 'System Health',
      value: '98%',
      icon: Activity,
      color: 'text-green-600'
    }
  ]

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-sm text-gray-600">{stat.label}</span>
                  </div>
                  <span className={`text-sm font-medium ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-900">AI Status</span>
          </div>
          <p className="text-xs text-primary-700">
            ML models are actively learning from traffic patterns
          </p>
          <div className="mt-2 w-full bg-primary-200 rounded-full h-1">
            <div className="bg-primary-600 h-1 rounded-full w-3/4"></div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar