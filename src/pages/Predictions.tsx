import React, { useState } from 'react'
import { 
  Brain,
  TrendingUp,
  AlertCircle,
  Calendar,
  MapPin,
  Zap,
  Target,
  Clock
} from 'lucide-react'
import TrafficChart from '../components/TrafficChart'
import MetricCard from '../components/MetricCard'
import { useTraffic } from '../context/TrafficContext'
import { format, addHours, addDays } from 'date-fns'

const Predictions: React.FC = () => {
  const { state } = useTraffic()
  const { predictions, isLoading } = state
  const [predictionRange, setPredictionRange] = useState('24h')
  const [selectedLocation, setSelectedLocation] = useState('all')

  // Generate ML prediction data
  const generatePredictions = (hours: number) => {
    return Array.from({ length: hours }, (_, i) => {
      const timestamp = addHours(new Date(), i)
      const baseVolume = 200 + Math.sin(i * Math.PI / 12) * 150 // Simulate daily pattern
      const randomVariation = (Math.random() - 0.5) * 50
      
      return {
        timestamp: timestamp.toISOString(),
        time: format(timestamp, 'HH:mm'),
        predictedVolume: Math.max(50, Math.round(baseVolume + randomVariation)),
        confidence: Math.random() * 0.3 + 0.7,
        factors: {
          weather: Math.random() * 0.3 + 0.1,
          events: Math.random() * 0.2 + 0.05,
          historical: Math.random() * 0.4 + 0.3,
          seasonal: Math.random() * 0.2 + 0.1
        },
        congestionRisk: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
      }
    })
  }

  const predictionData = generatePredictions(predictionRange === '24h' ? 24 : predictionRange === '7d' ? 168 : 720)

  // ML Model Performance Metrics
  const modelMetrics = {
    accuracy: 94.2,
    precision: 91.8,
    recall: 96.1,
    f1Score: 93.9,
    lastTrained: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    dataPoints: 125000,
    features: 23
  }

  // Feature importance data
  const featureImportance = [
    { feature: 'Historical Patterns', importance: 0.35, description: 'Past traffic data at same time/location' },
    { feature: 'Weather Conditions', importance: 0.22, description: 'Temperature, precipitation, visibility' },
    { feature: 'Day of Week', importance: 0.18, description: 'Weekday vs weekend patterns' },
    { feature: 'Special Events', importance: 0.12, description: 'Concerts, sports, holidays' },
    { feature: 'Road Conditions', importance: 0.08, description: 'Construction, accidents, closures' },
    { feature: 'Economic Factors', importance: 0.05, description: 'Fuel prices, employment rates' }
  ]

  // Prediction scenarios
  const scenarios = [
    {
      name: 'Normal Conditions',
      probability: 0.65,
      avgVolume: 320,
      peakVolume: 480,
      description: 'Typical traffic patterns expected'
    },
    {
      name: 'High Congestion',
      probability: 0.25,
      avgVolume: 450,
      peakVolume: 680,
      description: 'Above average traffic due to events'
    },
    {
      name: 'Weather Impact',
      probability: 0.10,
      avgVolume: 280,
      peakVolume: 420,
      description: 'Reduced traffic due to weather conditions'
    }
  ]

  const avgConfidence = predictionData.reduce((sum, item) => sum + item.confidence, 0) / predictionData.length
  const highRiskPeriods = predictionData.filter(item => item.congestionRisk === 'high').length
  const peakPrediction = Math.max(...predictionData.map(item => item.predictedVolume))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-gray-600">Loading ML predictions...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ML Traffic Predictions</h1>
          <p className="text-gray-600 mt-1">
            AI-powered traffic forecasting with machine learning insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={predictionRange}
            onChange={(e) => setPredictionRange(e.target.value)}
            className="input-field w-32"
          >
            <option value="24h">24 Hours</option>
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
          </select>
          <select 
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="input-field w-48"
          >
            <option value="all">All Locations</option>
            <option value="highway">Highway Routes</option>
            <option value="urban">Urban Areas</option>
            <option value="suburban">Suburban Roads</option>
          </select>
        </div>
      </div>

      {/* ML Model Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Model Accuracy"
          value={`${modelMetrics.accuracy}%`}
          change={{ value: 1.2, type: 'increase' }}
          icon={Target}
          color="green"
          description="Prediction accuracy"
        />
        <MetricCard
          title="Avg Confidence"
          value={`${Math.round(avgConfidence * 100)}%`}
          icon={Brain}
          color="blue"
          description="Prediction confidence"
        />
        <MetricCard
          title="High Risk Periods"
          value={highRiskPeriods}
          icon={AlertCircle}
          color="orange"
          description={`Next ${predictionRange}`}
        />
        <MetricCard
          title="Peak Prediction"
          value={peakPrediction.toLocaleString()}
          icon={TrendingUp}
          color="purple"
          description="Vehicles/hour"
        />
      </div>

      {/* Main Prediction Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrafficChart
            data={predictionData}
            type="area"
            title="Traffic Volume Predictions"
            dataKey="predictedVolume"
            xAxisKey="time"
            color="#8b5cf6"
            height={400}
          />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Scenarios</h3>
          <div className="space-y-4">
            {scenarios.map((scenario, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                  <span className="text-sm font-medium text-primary-600">
                    {Math.round(scenario.probability * 100)}%
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3">{scenario.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Avg:</span>
                    <span className="ml-1 font-medium">{scenario.avgVolume}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Peak:</span>
                    <span className="ml-1 font-medium">{scenario.peakVolume}</span>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-primary-600 h-1 rounded-full" 
                    style={{ width: `${scenario.probability * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Importance & Model Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Importance</h3>
          <div className="space-y-4">
            {featureImportance.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{item.feature}</span>
                  <span className="text-sm text-gray-600">{Math.round(item.importance * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full" 
                    style={{ width: `${item.importance * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Performance</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{modelMetrics.accuracy}%</p>
              <p className="text-sm text-green-700">Accuracy</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{modelMetrics.precision}%</p>
              <p className="text-sm text-blue-700">Precision</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{modelMetrics.recall}%</p>
              <p className="text-sm text-purple-700">Recall</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{modelMetrics.f1Score}%</p>
              <p className="text-sm text-orange-700">F1-Score</p>
            </div>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Training Data Points:</span>
              <span className="font-medium">{modelMetrics.dataPoints.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Features Used:</span>
              <span className="font-medium">{modelMetrics.features}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Trained:</span>
              <span className="font-medium">{format(modelMetrics.lastTrained, 'MMM dd, HH:mm')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Alerts */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Prediction Alerts</h3>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">Auto-generated insights</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-900">High Congestion Alert</span>
            </div>
            <p className="text-xs text-red-700 mb-2">
              Expected heavy traffic on Highway A1 between 17:00-19:00
            </p>
            <div className="flex items-center space-x-2 text-xs text-red-600">
              <Clock className="w-3 h-3" />
              <span>In 3 hours</span>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">Weather Impact</span>
            </div>
            <p className="text-xs text-yellow-700 mb-2">
              Rain expected to reduce traffic volume by 15-20% tomorrow
            </p>
            <div className="flex items-center space-x-2 text-xs text-yellow-600">
              <Calendar className="w-3 h-3" />
              <span>Tomorrow 06:00</span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Optimization Opportunity</span>
            </div>
            <p className="text-xs text-blue-700 mb-2">
              Signal timing adjustment could improve flow by 12%
            </p>
            <div className="flex items-center space-x-2 text-xs text-blue-600">
              <MapPin className="w-3 h-3" />
              <span>Downtown Main St</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Predictions