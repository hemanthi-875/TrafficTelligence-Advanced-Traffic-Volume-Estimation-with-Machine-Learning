import React, { useState } from 'react'
import { 
  Calendar,
  Download,
  Filter,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import TrafficChart from '../components/TrafficChart'
import MetricCard from '../components/MetricCard'
import { useTraffic } from '../context/TrafficContext'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'

const Analytics: React.FC = () => {
  const { state } = useTraffic()
  const { currentData } = state
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('volume')

  // Generate historical data for different periods
  const generateHistoricalData = (days: number) => {
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - i - 1)
      return {
        timestamp: date.toISOString(),
        date: format(date, 'MMM dd'),
        vehicleCount: Math.floor(Math.random() * 500) + 200,
        averageSpeed: Math.floor(Math.random() * 40) + 30,
        congestionEvents: Math.floor(Math.random() * 10),
        weatherImpact: Math.random() * 0.3,
        efficiency: Math.random() * 0.4 + 0.6
      }
    })
  }

  const historicalData = generateHistoricalData(
    selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90
  )

  // Peak hours analysis
  const peakHoursData = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    volume: Math.floor(Math.random() * 300) + 100 + (hour >= 7 && hour <= 9 || hour >= 17 && hour <= 19 ? 200 : 0),
    speed: Math.floor(Math.random() * 20) + 40 - (hour >= 7 && hour <= 9 || hour >= 17 && hour <= 19 ? 15 : 0)
  }))

  // Weather impact analysis
  const weatherData = [
    { condition: 'Clear', impact: 0.95, volume: 450 },
    { condition: 'Rainy', impact: 0.75, volume: 320 },
    { condition: 'Foggy', impact: 0.65, volume: 280 },
    { condition: 'Snowy', impact: 0.45, volume: 180 }
  ]

  // Route efficiency data
  const routeEfficiencyData = [
    { route: 'Highway A1', efficiency: 0.85, avgSpeed: 65, volume: 1200 },
    { route: 'Downtown Main', efficiency: 0.62, avgSpeed: 35, volume: 800 },
    { route: 'Airport Road', efficiency: 0.78, avgSpeed: 55, volume: 950 },
    { route: 'Industrial Zone', efficiency: 0.71, avgSpeed: 45, volume: 600 },
    { route: 'Suburban Route', efficiency: 0.88, avgSpeed: 50, volume: 400 }
  ]

  const totalVolume = historicalData.reduce((sum, item) => sum + item.vehicleCount, 0)
  const avgSpeed = Math.round(historicalData.reduce((sum, item) => sum + item.averageSpeed, 0) / historicalData.length)
  const totalEvents = historicalData.reduce((sum, item) => sum + item.congestionEvents, 0)
  const avgEfficiency = Math.round(historicalData.reduce((sum, item) => sum + item.efficiency, 0) / historicalData.length * 100)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Traffic Analytics</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive analysis and insights from traffic data
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field w-32"
          >
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
          </select>
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Volume"
          value={totalVolume.toLocaleString()}
          change={{ value: 8.3, type: 'increase' }}
          icon={BarChart3}
          color="blue"
          description={`Past ${selectedPeriod}`}
        />
        <MetricCard
          title="Average Speed"
          value={`${avgSpeed} km/h`}
          change={{ value: 2.1, type: 'increase' }}
          icon={TrendingUp}
          color="green"
          description="Network average"
        />
        <MetricCard
          title="Congestion Events"
          value={totalEvents}
          change={{ value: 15.2, type: 'decrease' }}
          icon={Activity}
          color="orange"
          description="Total incidents"
        />
        <MetricCard
          title="System Efficiency"
          value={`${avgEfficiency}%`}
          change={{ value: 5.7, type: 'increase' }}
          icon={PieChart}
          color="purple"
          description="Overall performance"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrafficChart
          data={historicalData}
          type="area"
          title="Traffic Volume Trend"
          dataKey="vehicleCount"
          xAxisKey="date"
          color="#3b82f6"
          height={350}
        />
        <TrafficChart
          data={historicalData}
          type="line"
          title="Average Speed Analysis"
          dataKey="averageSpeed"
          xAxisKey="date"
          color="#10b981"
          height={350}
        />
      </div>

      {/* Peak Hours Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrafficChart
            data={peakHoursData}
            type="bar"
            title="Peak Hours Analysis"
            dataKey="volume"
            xAxisKey="hour"
            color="#f59e0b"
            height={300}
          />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Insights</h3>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Morning Rush</p>
              <p className="text-xs text-blue-700">7:00 - 9:00 AM</p>
              <p className="text-lg font-bold text-blue-900">+65% volume</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-sm font-medium text-orange-900">Evening Rush</p>
              <p className="text-xs text-orange-700">5:00 - 7:00 PM</p>
              <p className="text-lg font-bold text-orange-900">+78% volume</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-900">Off-Peak</p>
              <p className="text-xs text-green-700">10:00 PM - 6:00 AM</p>
              <p className="text-lg font-bold text-green-900">-45% volume</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Impact & Route Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Impact Analysis</h3>
          <div className="space-y-3">
            {weatherData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.condition}</p>
                  <p className="text-sm text-gray-600">{item.volume} avg vehicles</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {Math.round(item.impact * 100)}%
                  </p>
                  <p className="text-xs text-gray-500">efficiency</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Efficiency</h3>
          <div className="space-y-3">
            {routeEfficiencyData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.route}</p>
                  <p className="text-sm text-gray-600">{item.avgSpeed} km/h • {item.volume} vehicles</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${item.efficiency * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round(item.efficiency * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analysis Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Traffic Analysis</h3>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {format(subDays(new Date(), parseInt(selectedPeriod)), 'MMM dd')} - {format(new Date(), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Volume</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Speed</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Events</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Efficiency</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Weather Impact</th>
              </tr>
            </thead>
            <tbody>
              {historicalData.slice(-7).map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{item.date}</td>
                  <td className="py-3 px-4 text-gray-900">{item.vehicleCount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-900">{item.averageSpeed} km/h</td>
                  <td className="py-3 px-4 text-gray-900">{item.congestionEvents}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.efficiency > 0.8 ? 'bg-green-100 text-green-800' :
                      item.efficiency > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {Math.round(item.efficiency * 100)}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(1 - item.weatherImpact) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Analytics