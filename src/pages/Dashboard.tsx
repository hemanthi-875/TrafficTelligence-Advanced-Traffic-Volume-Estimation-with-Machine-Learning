import React from 'react'
import { 
  Car, 
  TrendingUp, 
  AlertTriangle, 
  Clock,
  MapPin,
  Thermometer,
  Eye,
  Calendar
} from 'lucide-react'
import MetricCard from '../components/MetricCard'
import TrafficChart from '../components/TrafficChart'
import { useTraffic } from '../context/TrafficContext'
import { format } from 'date-fns'

const Dashboard: React.FC = () => {
  const { state } = useTraffic()
  const { currentData, isLoading } = state

  // Calculate metrics from current data
  const totalVehicles = currentData.reduce((sum, item) => sum + item.vehicleCount, 0)
  const averageSpeed = currentData.length > 0 
    ? Math.round(currentData.reduce((sum, item) => sum + item.averageSpeed, 0) / currentData.length)
    : 0
  const criticalAlerts = currentData.filter(item => item.congestionLevel === 'critical').length
  const activeSensors = new Set(currentData.map(item => item.location)).size

  // Prepare chart data
  const hourlyData = currentData
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-24)
    .map(item => ({
      timestamp: item.timestamp,
      vehicleCount: item.vehicleCount,
      averageSpeed: item.averageSpeed,
      congestionLevel: item.congestionLevel
    }))

  const congestionData = [
    { name: 'Low', value: currentData.filter(d => d.congestionLevel === 'low').length },
    { name: 'Medium', value: currentData.filter(d => d.congestionLevel === 'medium').length },
    { name: 'High', value: currentData.filter(d => d.congestionLevel === 'high').length },
    { name: 'Critical', value: currentData.filter(d => d.congestionLevel === 'critical').length }
  ]

  const locationData = Object.entries(
    currentData.reduce((acc, item) => {
      acc[item.location] = (acc[item.location] || 0) + item.vehicleCount
      return acc
    }, {} as Record<string, number>)
  ).map(([location, count]) => ({
    location,
    vehicleCount: count,
    timestamp: new Date().toISOString()
  }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-gray-600">Loading traffic data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Traffic Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time traffic monitoring and analysis • Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="input-field w-48">
            <option value="all">All Locations</option>
            <option value="highway">Highway Routes</option>
            <option value="urban">Urban Areas</option>
            <option value="suburban">Suburban Roads</option>
          </select>
          <select className="input-field w-32">
            <option value="24h">24 Hours</option>
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Vehicles"
          value={totalVehicles.toLocaleString()}
          change={{ value: 12.5, type: 'increase' }}
          icon={Car}
          color="blue"
          description="Last 24 hours"
        />
        <MetricCard
          title="Average Speed"
          value={`${averageSpeed} km/h`}
          change={{ value: 3.2, type: 'decrease' }}
          icon={TrendingUp}
          color="green"
          description="Network-wide"
        />
        <MetricCard
          title="Critical Alerts"
          value={criticalAlerts}
          change={{ value: 25, type: 'increase' }}
          icon={AlertTriangle}
          color="red"
          description="Requires attention"
        />
        <MetricCard
          title="Active Sensors"
          value={activeSensors}
          icon={MapPin}
          color="purple"
          description="Online monitoring"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrafficChart
          data={hourlyData}
          type="area"
          title="Vehicle Volume Trend"
          dataKey="vehicleCount"
          color="#3b82f6"
          height={300}
        />
        <TrafficChart
          data={hourlyData}
          type="line"
          title="Average Speed Trend"
          dataKey="averageSpeed"
          color="#10b981"
          height={300}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrafficChart
            data={locationData}
            type="bar"
            title="Traffic Volume by Location"
            dataKey="vehicleCount"
            xAxisKey="location"
            color="#f59e0b"
            height={300}
          />
        </div>
        <div>
          <TrafficChart
            data={congestionData}
            type="pie"
            title="Congestion Distribution"
            dataKey="value"
            height={300}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Traffic Events</h3>
          <button className="btn-secondary">View All</button>
        </div>
        <div className="space-y-4">
          {currentData.slice(0, 5).map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  item.congestionLevel === 'critical' ? 'bg-red-500' :
                  item.congestionLevel === 'high' ? 'bg-orange-500' :
                  item.congestionLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">{item.location}</p>
                  <p className="text-sm text-gray-600">
                    {item.vehicleCount} vehicles • {item.averageSpeed} km/h avg speed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {format(new Date(item.timestamp), 'HH:mm')}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Thermometer className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{item.temperature}°C</span>
                  <Eye className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{item.visibility}km</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard