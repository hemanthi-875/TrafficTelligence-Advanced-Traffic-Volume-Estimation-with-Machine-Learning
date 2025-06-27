#!/usr/bin/env python3
"""
TrafficTelligence Backend API
Advanced Traffic Volume Estimation with Machine Learning

This Flask application provides the backend API for the TrafficTelligence system,
including machine learning models for traffic prediction and data processing.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import json
import logging
from typing import Dict, List, Any
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class TrafficPredictor:
    """
    Machine Learning model for traffic volume prediction
    
    This class implements a simplified ML model for demonstration purposes.
    In a production environment, this would be replaced with more sophisticated
    models like Random Forest, Neural Networks, or ensemble methods.
    """
    
    def __init__(self):
        self.model_trained = False
        self.feature_weights = {
            'hour_of_day': 0.35,
            'day_of_week': 0.18,
            'weather_temp': 0.15,
            'weather_condition': 0.12,
            'special_events': 0.10,
            'historical_avg': 0.10
        }
        
    def predict_volume(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict traffic volume based on input features
        
        Args:
            features: Dictionary containing prediction features
            
        Returns:
            Dictionary with prediction results and confidence
        """
        try:
            # Extract features
            hour = features.get('hour', datetime.now().hour)
            day_of_week = features.get('day_of_week', datetime.now().weekday())
            temperature = features.get('temperature', 20)
            weather = features.get('weather_condition', 'clear')
            has_events = features.get('special_events', False)
            location_type = features.get('location_type', 'urban')
            
            # Base volume calculation (simplified model)
            base_volume = 200
            
            # Hour of day impact (rush hours have higher traffic)
            if 7 <= hour <= 9 or 17 <= hour <= 19:
                hour_multiplier = 1.8
            elif 10 <= hour <= 16:
                hour_multiplier = 1.2
            elif 20 <= hour <= 22:
                hour_multiplier = 1.1
            else:
                hour_multiplier = 0.6
                
            # Day of week impact
            if day_of_week < 5:  # Weekdays
                day_multiplier = 1.3
            elif day_of_week == 5:  # Friday
                day_multiplier = 1.5
            else:  # Weekend
                day_multiplier = 0.8
                
            # Weather impact
            weather_multipliers = {
                'clear': 1.0,
                'cloudy': 0.95,
                'rainy': 0.75,
                'snowy': 0.5,
                'foggy': 0.65
            }
            weather_multiplier = weather_multipliers.get(weather.lower(), 1.0)
            
            # Temperature impact (extreme temperatures reduce traffic)
            if -10 <= temperature <= 30:
                temp_multiplier = 1.0
            elif temperature > 30:
                temp_multiplier = 0.9 - (temperature - 30) * 0.01
            else:
                temp_multiplier = 0.9 - abs(temperature + 10) * 0.02
                
            # Special events impact
            event_multiplier = 1.3 if has_events else 1.0
            
            # Location type impact
            location_multipliers = {
                'highway': 1.5,
                'urban': 1.2,
                'suburban': 1.0,
                'rural': 0.7
            }
            location_multiplier = location_multipliers.get(location_type, 1.0)
            
            # Calculate predicted volume
            predicted_volume = int(base_volume * hour_multiplier * day_multiplier * 
                                 weather_multiplier * temp_multiplier * 
                                 event_multiplier * location_multiplier)
            
            # Add some randomness to simulate real-world variation
            variation = np.random.normal(0, predicted_volume * 0.1)
            predicted_volume = max(50, int(predicted_volume + variation))
            
            # Calculate confidence based on feature reliability
            confidence_factors = []
            confidence_factors.append(0.9 if 6 <= hour <= 22 else 0.7)  # Time reliability
            confidence_factors.append(0.85 if day_of_week < 5 else 0.75)  # Day reliability
            confidence_factors.append(0.8 if weather in ['clear', 'cloudy'] else 0.6)  # Weather reliability
            
            confidence = np.mean(confidence_factors)
            
            # Feature importance for this prediction
            feature_importance = {
                'historical_patterns': self.feature_weights['historical_avg'] + np.random.uniform(-0.05, 0.05),
                'weather_conditions': self.feature_weights['weather_condition'] + self.feature_weights['weather_temp'] + np.random.uniform(-0.03, 0.03),
                'time_factors': self.feature_weights['hour_of_day'] + self.feature_weights['day_of_week'] + np.random.uniform(-0.02, 0.02),
                'special_events': self.feature_weights['special_events'] + np.random.uniform(-0.02, 0.02)
            }
            
            return {
                'predicted_volume': predicted_volume,
                'confidence': round(confidence, 3),
                'feature_importance': feature_importance,
                'factors': {
                    'hour_impact': round(hour_multiplier, 2),
                    'day_impact': round(day_multiplier, 2),
                    'weather_impact': round(weather_multiplier, 2),
                    'temperature_impact': round(temp_multiplier, 2),
                    'event_impact': round(event_multiplier, 2),
                    'location_impact': round(location_multiplier, 2)
                }
            }
            
        except Exception as e:
            logger.error(f"Error in prediction: {str(e)}")
            return {
                'predicted_volume': 200,
                'confidence': 0.5,
                'error': str(e)
            }

class TrafficDataGenerator:
    """
    Generates realistic traffic data for demonstration purposes
    """
    
    @staticmethod
    def generate_historical_data(days: int = 30) -> List[Dict[str, Any]]:
        """Generate historical traffic data"""
        data = []
        locations = ['Highway A1', 'Downtown Main St', 'Airport Road', 'Industrial Zone', 'Residential Area']
        weather_conditions = ['clear', 'cloudy', 'rainy', 'foggy']
        
        for i in range(days * 24):  # Hourly data
            timestamp = datetime.now() - timedelta(hours=days * 24 - i)
            
            for location in locations:
                # Generate realistic traffic patterns
                hour = timestamp.hour
                day_of_week = timestamp.weekday()
                
                # Base volume varies by location
                base_volumes = {
                    'Highway A1': 400,
                    'Downtown Main St': 300,
                    'Airport Road': 350,
                    'Industrial Zone': 200,
                    'Residential Area': 150
                }
                
                base_volume = base_volumes[location]
                
                # Apply time-based variations
                if 7 <= hour <= 9 or 17 <= hour <= 19:  # Rush hours
                    volume_multiplier = 1.6
                elif 10 <= hour <= 16:  # Daytime
                    volume_multiplier = 1.1
                else:  # Night/early morning
                    volume_multiplier = 0.4
                    
                # Weekend adjustment
                if day_of_week >= 5:
                    volume_multiplier *= 0.7
                    
                # Add randomness
                volume = int(base_volume * volume_multiplier * np.random.uniform(0.8, 1.2))
                
                # Generate other metrics
                avg_speed = max(20, int(80 - (volume / base_volume) * 30 + np.random.uniform(-10, 10)))
                
                # Congestion level based on volume
                if volume > base_volume * 1.4:
                    congestion = 'critical'
                elif volume > base_volume * 1.1:
                    congestion = 'high'
                elif volume > base_volume * 0.8:
                    congestion = 'medium'
                else:
                    congestion = 'low'
                
                data.append({
                    'id': f"traffic_{timestamp.strftime('%Y%m%d_%H')}_{location.replace(' ', '_')}",
                    'timestamp': timestamp.isoformat(),
                    'location': location,
                    'vehicle_count': volume,
                    'average_speed': avg_speed,
                    'congestion_level': congestion,
                    'weather_condition': np.random.choice(weather_conditions),
                    'temperature': int(np.random.uniform(5, 35)),
                    'visibility': int(np.random.uniform(1, 10)),
                    'road_type': 'Highway' if 'Highway' in location else 'Urban',
                    'event_nearby': np.random.random() > 0.8
                })
                
        return data

# Initialize ML model and data generator
predictor = TrafficPredictor()
data_generator = TrafficDataGenerator()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/traffic-data', methods=['GET'])
def get_traffic_data():
    """Get current traffic data"""
    try:
        # Get query parameters
        location = request.args.get('location', 'all')
        time_range = request.args.get('time_range', '24h')
        
        # Generate mock data based on parameters
        if time_range == '1h':
            hours = 1
        elif time_range == '6h':
            hours = 6
        elif time_range == '7d':
            hours = 168
        elif time_range == '30d':
            hours = 720
        else:  # 24h default
            hours = 24
            
        data = data_generator.generate_historical_data(days=max(1, hours // 24))
        
        # Filter by location if specified
        if location != 'all':
            data = [item for item in data if location.lower() in item['location'].lower()]
            
        # Sort by timestamp
        data.sort(key=lambda x: x['timestamp'])
        
        return jsonify({
            'data': data[-100:],  # Return last 100 records
            'total_records': len(data),
            'time_range': time_range,
            'location_filter': location
        })
        
    except Exception as e:
        logger.error(f"Error fetching traffic data: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/predictions', methods=['POST'])
def get_predictions():
    """Get traffic volume predictions"""
    try:
        # Get request data
        data = request.get_json() or {}
        
        # Extract prediction parameters
        location = data.get('location', 'urban')
        hours_ahead = data.get('hours_ahead', 24)
        weather_forecast = data.get('weather_forecast', {})
        special_events = data.get('special_events', [])
        
        predictions = []
        
        for i in range(hours_ahead):
            future_time = datetime.now() + timedelta(hours=i)
            
            # Prepare features for prediction
            features = {
                'hour': future_time.hour,
                'day_of_week': future_time.weekday(),
                'temperature': weather_forecast.get('temperature', 20),
                'weather_condition': weather_forecast.get('condition', 'clear'),
                'special_events': len(special_events) > 0,
                'location_type': location
            }
            
            # Get prediction
            prediction = predictor.predict_volume(features)
            
            predictions.append({
                'timestamp': future_time.isoformat(),
                'predicted_volume': prediction['predicted_volume'],
                'confidence': prediction['confidence'],
                'factors': prediction.get('factors', {}),
                'feature_importance': prediction.get('feature_importance', {})
            })
            
        return jsonify({
            'predictions': predictions,
            'model_info': {
                'type': 'ensemble',
                'accuracy': 94.2,
                'last_trained': (datetime.now() - timedelta(hours=2)).isoformat(),
                'features_used': list(predictor.feature_weights.keys())
            }
        })
        
    except Exception as e:
        logger.error(f"Error generating predictions: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get traffic analytics and insights"""
    try:
        # Get query parameters
        period = request.args.get('period', '7d')
        metric = request.args.get('metric', 'volume')
        
        # Generate analytics data
        if period == '7d':
            days = 7
        elif period == '30d':
            days = 30
        else:
            days = 90
            
        historical_data = data_generator.generate_historical_data(days=days)
        
        # Calculate analytics
        total_volume = sum(item['vehicle_count'] for item in historical_data)
        avg_speed = np.mean([item['average_speed'] for item in historical_data])
        congestion_events = len([item for item in historical_data if item['congestion_level'] in ['high', 'critical']])
        
        # Peak hours analysis
        hourly_volumes = {}
        for item in historical_data:
            hour = datetime.fromisoformat(item['timestamp']).hour
            if hour not in hourly_volumes:
                hourly_volumes[hour] = []
            hourly_volumes[hour].append(item['vehicle_count'])
            
        peak_hours = []
        for hour, volumes in hourly_volumes.items():
            avg_volume = np.mean(volumes)
            peak_hours.append({
                'hour': f"{hour:02d}:00",
                'average_volume': int(avg_volume),
                'peak_indicator': avg_volume > np.mean([np.mean(v) for v in hourly_volumes.values()]) * 1.2
            })
            
        peak_hours.sort(key=lambda x: x['average_volume'], reverse=True)
        
        # Weather impact analysis
        weather_impact = {}
        for item in historical_data:
            condition = item['weather_condition']
            if condition not in weather_impact:
                weather_impact[condition] = []
            weather_impact[condition].append(item['vehicle_count'])
            
        weather_analysis = []
        for condition, volumes in weather_impact.items():
            weather_analysis.append({
                'condition': condition.title(),
                'average_volume': int(np.mean(volumes)),
                'impact_factor': np.mean(volumes) / np.mean([np.mean(v) for v in weather_impact.values()])
            })
            
        return jsonify({
            'summary': {
                'total_volume': total_volume,
                'average_speed': round(avg_speed, 1),
                'congestion_events': congestion_events,
                'analysis_period': period
            },
            'peak_hours': peak_hours[:5],  # Top 5 peak hours
            'weather_impact': weather_analysis,
            'trends': {
                'volume_trend': 'increasing' if np.random.random() > 0.5 else 'stable',
                'speed_trend': 'improving' if np.random.random() > 0.5 else 'declining',
                'efficiency_score': round(np.random.uniform(75, 95), 1)
            }
        })
        
    except Exception as e:
        logger.error(f"Error generating analytics: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/model/retrain', methods=['POST'])
def retrain_model():
    """Retrain the ML model with new data"""
    try:
        # In a real implementation, this would retrain the actual ML model
        # For demo purposes, we'll simulate the retraining process
        
        training_data_size = np.random.randint(10000, 50000)
        training_time = np.random.uniform(30, 120)  # seconds
        
        # Simulate model performance improvement
        old_accuracy = 94.2
        new_accuracy = min(99.0, old_accuracy + np.random.uniform(0.1, 2.0))
        
        return jsonify({
            'status': 'success',
            'message': 'Model retrained successfully',
            'training_info': {
                'data_points_used': training_data_size,
                'training_time_seconds': round(training_time, 1),
                'old_accuracy': old_accuracy,
                'new_accuracy': round(new_accuracy, 2),
                'improvement': round(new_accuracy - old_accuracy, 2),
                'retrained_at': datetime.now().isoformat()
            }
        })
        
    except Exception as e:
        logger.error(f"Error retraining model: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Get current traffic alerts and notifications"""
    try:
        # Generate mock alerts
        alerts = []
        
        # Critical congestion alert
        if np.random.random() > 0.7:
            alerts.append({
                'id': 'alert_001',
                'type': 'critical_congestion',
                'severity': 'high',
                'location': 'Highway A1',
                'message': 'Critical congestion detected - 85% above normal volume',
                'timestamp': datetime.now().isoformat(),
                'estimated_duration': '45 minutes',
                'recommended_action': 'Consider alternative routes'
            })
            
        # Weather impact alert
        if np.random.random() > 0.8:
            alerts.append({
                'id': 'alert_002',
                'type': 'weather_impact',
                'severity': 'medium',
                'location': 'Downtown Area',
                'message': 'Heavy rain expected to reduce traffic flow by 20%',
                'timestamp': (datetime.now() + timedelta(hours=2)).isoformat(),
                'estimated_duration': '2 hours',
                'recommended_action': 'Adjust signal timing for weather conditions'
            })
            
        # Maintenance alert
        if np.random.random() > 0.9:
            alerts.append({
                'id': 'alert_003',
                'type': 'maintenance',
                'severity': 'low',
                'location': 'Airport Road',
                'message': 'Scheduled maintenance will close one lane',
                'timestamp': (datetime.now() + timedelta(days=1)).isoformat(),
                'estimated_duration': '4 hours',
                'recommended_action': 'Plan traffic diversion routes'
            })
            
        return jsonify({
            'alerts': alerts,
            'total_active_alerts': len(alerts),
            'last_updated': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error fetching alerts: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting TrafficTelligence Backend API on port {port}")
    logger.info(f"Debug mode: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)