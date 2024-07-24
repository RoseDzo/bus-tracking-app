import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert, StyleSheet, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import LoginScreen from './screens/LoginScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false }}/>
        <Stack.Screen name="Map" component={Map} options={{headerShown: true, gestureEnabled: true }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const Map = () => {
  const [busLocation, setBusLocation] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    initWebSocket();
    initLocation();
  }, []);

  const initWebSocket = () => {
    const socket = new WebSocket('ws://172.20.10.4:8080');

    socket.onmessage = (event) => {
      const newBusLocation = JSON.parse(event.data);
      setBusLocation(newBusLocation);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const initLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  if (!location) {
    return null;
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
      {busLocation && (
        <Marker
          coordinate={{
            latitude: busLocation.latitude,
            longitude: busLocation.longitude,
          }}
          title="Bus"
          description={busLocation.route}
        >
          <Image
            source={require('./assets/bus-vector.jpg')}
            style={styles.busIcon}
          />
        </Marker>
      )}
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
});
