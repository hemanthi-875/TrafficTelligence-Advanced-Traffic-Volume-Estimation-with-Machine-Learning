import React from 'react'
import { DivideIcon as LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon: LucideIcon
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple'
  description?: string
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color = 'blue',
  description
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      change: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      change: 'text-green-600'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'text-orange-600',
      change: 'text-orange-600'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      change: 'text-red-600'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      change: 'text-purple-600'
    }
  }

  const colors = colorClasses[color]

  return (
    <div className="metric-card group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors.bg} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
      
      {change && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${colors.change}`}>
            {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
          </span>
          <span className="text-xs text-gray-500 ml-2">vs last period</span>
        </div>
      )}
    </div>
  )
}

export default MetricCard