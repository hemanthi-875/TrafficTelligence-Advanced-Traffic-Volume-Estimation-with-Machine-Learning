import React, { createContext, useContext, useReducer, useEffect } from 'react'

export interface TrafficData {
  id: string
  timestamp: string
  location: string
  vehicleCount: number
  averageSpeed: number
  congestionLevel: 'low' | 'medium' | 'high' | 'critical'
  weatherCondition: string
  temperature: number
  visibility: number
  roadType: string
  eventNearby: boolean
}

export interface PredictionData {
  timestamp: string
  predictedVolume: number
  confidence: number
  factors: {
    weather: number
    events: number
    historical: number
    seasonal: number
  }
}

interface TrafficState {
  currentData: TrafficData[]
  predictions: PredictionData[]
  isLoading: boolean
  error: string | null
  selectedLocation: string
  timeRange: '1h' | '6h' | '24h' | '7d' | '30d'
}

type TrafficAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_DATA'; payload: TrafficData[] }
  | { type: 'SET_PREDICTIONS'; payload: PredictionData[] }
  | { type: 'SET_SELECTED_LOCATION'; payload: string }
  | { type: 'SET_TIME_RANGE'; payload: '1h' | '6h' | '24h' | '7d' | '30d' }

const initialState: TrafficState = {
  currentData: [],
  predictions: [],
  isLoading: false,
  error: null,
  selectedLocation: 'all',
  timeRange: '24h'
}

const trafficReducer = (state: TrafficState, action: TrafficAction): TrafficState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_CURRENT_DATA':
      return { ...state, currentData: action.payload, isLoading: false }
    case 'SET_PREDICTIONS':
      return { ...state, predictions: action.payload }
    case 'SET_SELECTED_LOCATION':
      return { ...state, selectedLocation: action.payload }
    case 'SET_TIME_RANGE':
      return { ...state, timeRange: action.payload }
    default:
      return state
  }
}

const TrafficContext = createContext<{
  state: TrafficState
  dispatch: React.Dispatch<TrafficAction>
  fetchTrafficData: () => Promise<void>
  fetchPredictions: () => Promise<void>
} | null>(null)

export const TrafficProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(trafficReducer, initialState)

  // Mock data generation for demonstration
  const generateMockTrafficData = (): TrafficData[] => {
    const locations = ['Highway A1', 'Downtown Main St', 'Airport Road', 'Industrial Zone', 'Residential Area']
    const weatherConditions = ['Clear', 'Rainy', 'Foggy', 'Cloudy', 'Snowy']
    const roadTypes = ['Highway', 'Urban', 'Suburban', 'Rural']
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: `traffic-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      location: locations[Math.floor(Math.random() * locations.length)],
      vehicleCount: Math.floor(Math.random() * 500) + 50,
      averageSpeed: Math.floor(Math.random() * 60) + 20,
      congestionLevel: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
      weatherCondition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
      temperature: Math.floor(Math.random() * 30) + 5,
      visibility: Math.floor(Math.random() * 10) + 1,
      roadType: roadTypes[Math.floor(Math.random() * roadTypes.length)],
      eventNearby: Math.random() > 0.7
    }))
  }

  const generateMockPredictions = (): PredictionData[] => {
    return Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() + i * 60 * 60 * 1000).toISOString(),
      predictedVolume: Math.floor(Math.random() * 400) + 100,
      confidence: Math.random() * 0.3 + 0.7,
      factors: {
        weather: Math.random() * 0.3 + 0.1,
        events: Math.random() * 0.2 + 0.05,
        historical: Math.random() * 0.4 + 0.3,
        seasonal: Math.random() * 0.2 + 0.1
      }
    }))
  }

  const fetchTrafficData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      // In a real application, this would be an API call
      // const response = await fetch('/api/traffic-data')
      // const data = await response.json()
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockData = generateMockTrafficData()
      dispatch({ type: 'SET_CURRENT_DATA', payload: mockData })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch traffic data' })
    }
  }

  const fetchPredictions = async () => {
    try {
      // In a real application, this would be an API call to the ML backend
      // const response = await fetch('/api/predictions')
      // const data = await response.json()
      
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const mockPredictions = generateMockPredictions()
      dispatch({ type: 'SET_PREDICTIONS', payload: mockPredictions })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch predictions' })
    }
  }

  useEffect(() => {
    fetchTrafficData()
    fetchPredictions()
  }, [state.selectedLocation, state.timeRange])

  return (
    <TrafficContext.Provider value={{ state, dispatch, fetchTrafficData, fetchPredictions }}>
      {children}
    </TrafficContext.Provider>
  )
}

export const useTraffic = () => {
  const context = useContext(TrafficContext)
  if (!context) {
    throw new Error('useTraffic must be used within a TrafficProvider')
  }
  return context
}