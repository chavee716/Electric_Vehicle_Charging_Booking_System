import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

// API configuration based on platform
const API_BASE_URL = __DEV__
  ? Platform.select({
      android: 'http://192.168.63.216:8800',      // Android emulator
      ios: 'http://localhost:8800',         // iOS simulator
      default: 'http://192.168.63.216:8800' // Physical device
    })
  : 'http://192.168.63.216:8800'; // Production URL

interface Station {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}
const chargingStationImage = require('../../assets/favicon.png');

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStations = async () => {
    try {
      console.log('Attempting to fetch stations from:', `${API_BASE_URL}/api/stations`);
      
      const response = await axios.get(`${API_BASE_URL}/api/stations`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Stations response:', response.data);
      setStations(response.data);
      setErrorMsg(null);
    } catch (error: any) {
      console.error('Full error:', error);
      console.error('Error details:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      
      if (error?.response?.status === 404) {
        setErrorMsg('Station data not found');
      } else if (error?.message?.includes('Network Error')) {
        setErrorMsg('Unable to connect to server. Please check your connection.');
      } else {
        setErrorMsg('Error loading charging stations');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        await fetchStations();
      } catch (error: any) {
        console.error('Error initializing:', error?.message);
        setErrorMsg('Error initializing map');
      }
    })();
  }, []);

  const initialRegion = {
    latitude: location?.coords.latitude || 52.4797,
    longitude: location?.coords.longitude || -1.90269,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleMarkerPress = (station: Station) => {
    setSelectedStation(station);
  };

  const CustomMarker = () => (
    <Image 
      source={chargingStationImage}
      style={{ width: 40, height: 40 }} // Adjust size as needed
    />
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading map and stations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {/* Current location marker */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            description="You are here"
            pinColor="blue"
          />
        )}

        {/* Charging station markers with custom image */}
        {stations && stations.length > 0 && stations.map((station) => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
            title={station.name}
            description={station.description}
            onPress={() => handleMarkerPress(station)}
          >
            <CustomMarker />
          </Marker>
        ))}
      </MapView>

      {/* Error message display */}
      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      {/* Selected station info */}
      {selectedStation && (
        <View style={styles.stationInfoContainer}>
          <Text style={styles.stationName}>{selectedStation.name}</Text>
          <Text style={styles.stationDescription}>{selectedStation.description}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  errorContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
  stationInfoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  stationDescription: {
    fontSize: 14,
    color: '#666',
  },
});