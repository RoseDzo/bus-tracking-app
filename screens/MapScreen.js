import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [buses, setBuses] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    initLocation();
    initWebSocket();
    fetchBuses(); // Optionally fetch buses initially
  }, []);

  const initLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const initWebSocket = () => {
    const ws = new WebSocket('ws://192.168.153.57:8080'); // Replace with your WebSocket server URL
    setWs(ws);

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      const busLocation = JSON.parse(event.data);
      setBuses((prevBuses) => [...prevBuses, busLocation]);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const fetchBuses = async () => {
    try {
      const response = await fetch('http://192.168.153.57:3000/get-bus-location'); // Replace with your server URL
      if (!response.ok) {
        throw new Error('Failed to fetch bus data');
      }
      const data = await response.json();
      setBuses(data.locations);
    } catch (error) {
      console.error('Error fetching bus data:', error);
      Alert.alert('Error fetching bus data');
    }
  };

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker
        coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }}
        title="You are here"
      />
      {buses.map((bus, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: bus.latitude,
            longitude: bus.longitude,
          }}
          title={`Bus`}
          description={`Timestamp: ${new Date(bus.timestamp).toLocaleString()}`}
        >
          <Image
            source={require('../assets/location.png')} 
            style={styles.busIcon}
          />
        </Marker>
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  busIcon: {
    width: 30,
    height: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;
