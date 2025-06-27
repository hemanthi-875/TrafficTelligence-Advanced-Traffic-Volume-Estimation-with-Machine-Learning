import React, { useState } from 'react'
import { 
  Settings as SettingsIcon,
  Bell,
  Database,
  Wifi,
  Shield,
  Users,
  MapPin,
  Clock,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    general: {
      systemName: 'TrafficTelligence System',
      timezone: 'UTC-5',
      language: 'English',
      refreshInterval: 30,
      autoSave: true
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
      criticalOnly: false,
      alertThreshold: 80
    },
    dataCollection: {
      realTimeCollection: true,
      historicalRetention: 365,
      anonymizeData: true,
      exportFormat: 'JSON',
      backupFrequency: 'daily'
    },
    mlModel: {
      autoRetrain: true,
      retrainFrequency: 'weekly',
      confidenceThreshold: 0.75,
      featureSelection: 'auto',
      modelType: 'ensemble'
    },
    sensors: {
      totalSensors: 24,
      activeSensors: 23,
      maintenanceMode: false,
      calibrationSchedule: 'monthly'
    }
  })

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'ml', label: 'ML Models', icon: RefreshCw },
    { id: 'sensors', label: 'Sensors', icon: Wifi },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'users', label: 'User Management', icon: Users }
  ]

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          System Name
        </label>
        <input
          type="text"
          value={settings.general.systemName}
          onChange={(e) => handleSettingChange('general', 'systemName', e.target.value)}
          className="input-field"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className="input-field"
          >
            <option value="UTC-5">UTC-5 (Eastern)</option>
            <option value="UTC-6">UTC-6 (Central)</option>
            <option value="UTC-7">UTC-7 (Mountain)</option>
            <option value="UTC-8">UTC-8 (Pacific)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={settings.general.language}
            onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
            className="input-field"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data Refresh Interval (seconds)
        </label>
        <input
          type="number"
          value={settings.general.refreshInterval}
          onChange={(e) => handleSettingChange('general', 'refreshInterval', parseInt(e.target.value))}
          className="input-field"
          min="5"
          max="300"
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="autoSave"
          checked={settings.general.autoSave}
          onChange={(e) => handleSettingChange('general', 'autoSave', e.target.checked)}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="autoSave" className="ml-2 text-sm text-gray-700">
          Enable auto-save for configuration changes
        </label>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Alert Types</h4>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="emailAlerts"
              checked={settings.notifications.emailAlerts}
              onChange={(e) => handleSettingChange('notifications', 'emailAlerts', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="emailAlerts" className="ml-2 text-sm text-gray-700">
              Email Alerts
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="smsAlerts"
              checked={settings.notifications.smsAlerts}
              onChange={(e) => handleSettingChange('notifications', 'smsAlerts', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="smsAlerts" className="ml-2 text-sm text-gray-700">
              SMS Alerts
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="pushNotifications"
              checked={settings.notifications.pushNotifications}
              onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="pushNotifications" className="ml-2 text-sm text-gray-700">
              Push Notifications
            </label>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Alert Preferences</h4>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="criticalOnly"
              checked={settings.notifications.criticalOnly}
              onChange={(e) => handleSettingChange('notifications', 'criticalOnly', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="criticalOnly" className="ml-2 text-sm text-gray-700">
              Critical Alerts Only
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Threshold (% congestion)
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={settings.notifications.alertThreshold}
              onChange={(e) => handleSettingChange('notifications', 'alertThreshold', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>50%</span>
              <span>{settings.notifications.alertThreshold}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Data Collection</h4>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="realTimeCollection"
              checked={settings.dataCollection.realTimeCollection}
              onChange={(e) => handleSettingChange('dataCollection', 'realTimeCollection', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="realTimeCollection" className="ml-2 text-sm text-gray-700">
              Real-time Data Collection
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymizeData"
              checked={settings.dataCollection.anonymizeData}
              onChange={(e) => handleSettingChange('dataCollection', 'anonymizeData', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="anonymizeData" className="ml-2 text-sm text-gray-700">
              Anonymize Personal Data
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Historical Data Retention (days)
            </label>
            <input
              type="number"
              value={settings.dataCollection.historicalRetention}
              onChange={(e) => handleSettingChange('dataCollection', 'historicalRetention', parseInt(e.target.value))}
              className="input-field"
              min="30"
              max="3650"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Data Export & Backup</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <select
              value={settings.dataCollection.exportFormat}
              onChange={(e) => handleSettingChange('dataCollection', 'exportFormat', e.target.value)}
              className="input-field"
            >
              <option value="JSON">JSON</option>
              <option value="CSV">CSV</option>
              <option value="XML">XML</option>
              <option value="Parquet">Parquet</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup Frequency
            </label>
            <select
              value={settings.dataCollection.backupFrequency}
              onChange={(e) => handleSettingChange('dataCollection', 'backupFrequency', e.target.value)}
              className="input-field"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMLSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Model Training</h4>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoRetrain"
              checked={settings.mlModel.autoRetrain}
              onChange={(e) => handleSettingChange('mlModel', 'autoRetrain', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="autoRetrain" className="ml-2 text-sm text-gray-700">
              Automatic Model Retraining
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retrain Frequency
            </label>
            <select
              value={settings.mlModel.retrainFrequency}
              onChange={(e) => handleSettingChange('mlModel', 'retrainFrequency', e.target.value)}
              className="input-field"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Type
            </label>
            <select
              value={settings.mlModel.modelType}
              onChange={(e) => handleSettingChange('mlModel', 'modelType', e.target.value)}
              className="input-field"
            >
              <option value="ensemble">Ensemble</option>
              <option value="neural_network">Neural Network</option>
              <option value="random_forest">Random Forest</option>
              <option value="gradient_boosting">Gradient Boosting</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Model Parameters</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confidence Threshold
            </label>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={settings.mlModel.confidenceThreshold}
              onChange={(e) => handleSettingChange('mlModel', 'confidenceThreshold', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>50%</span>
              <span>{Math.round(settings.mlModel.confidenceThreshold * 100)}%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feature Selection
            </label>
            <select
              value={settings.mlModel.featureSelection}
              onChange={(e) => handleSettingChange('mlModel', 'featureSelection', e.target.value)}
              className="input-field"
            >
              <option value="auto">Automatic</option>
              <option value="manual">Manual</option>
              <option value="correlation">Correlation-based</option>
              <option value="importance">Importance-based</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSensorSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{settings.sensors.totalSensors}</p>
          <p className="text-sm text-gray-600">Total Sensors</p>
        </div>
        <div className="card text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{settings.sensors.activeSensors}</p>
          <p className="text-sm text-gray-600">Active Sensors</p>
        </div>
        <div className="card text-center">
          <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{settings.sensors.totalSensors - settings.sensors.activeSensors}</p>
          <p className="text-sm text-gray-600">Offline Sensors</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Sensor Management</h4>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={settings.sensors.maintenanceMode}
              onChange={(e) => handleSettingChange('sensors', 'maintenanceMode', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="maintenanceMode" className="ml-2 text-sm text-gray-700">
              Maintenance Mode
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calibration Schedule
            </label>
            <select
              value={settings.sensors.calibrationSchedule}
              onChange={(e) => handleSettingChange('sensors', 'calibrationSchedule', e.target.value)}
              className="input-field"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Sensor Status</h4>
          <div className="space-y-2">
            {['Highway A1 - Sensor 01', 'Downtown Main - Sensor 02', 'Airport Road - Sensor 03', 'Industrial Zone - Sensor 04'].map((sensor, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">{sensor}</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${index === 1 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  <span className="text-xs text-gray-500">
                    {index === 1 ? 'Offline' : 'Online'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'data':
        return renderDataSettings()
      case 'ml':
        return renderMLSettings()
      case 'sensors':
        return renderSensorSettings()
      case 'security':
        return (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Security settings panel coming soon</p>
          </div>
        )
      case 'users':
        return (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">User management panel coming soon</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure TrafficTelligence system preferences and parameters
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-secondary">Reset to Defaults</button>
          <button className="btn-primary flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage your {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} preferences
              </p>
            </div>
            
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings