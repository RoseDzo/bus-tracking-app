import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, Image, ImageBackground } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import logo from './assets/splash.png';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLoading(false);
    })();
  }, []);

  const startSharing = () => {
    setIsSharing(true);
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 1,
      },
      (newLocation) => {
        setLocation(newLocation);
        sendLocationToServer(newLocation.coords.latitude, newLocation.coords.longitude);
      }
    );
  };

  const stopSharing = () => {
    setIsSharing(false);
    Location.hasServicesEnabledAsync().then((enabled) => {
      if (enabled) {
        Location.stopLocationUpdatesAsync();
      }
    });
  };

  const sendLocationToServer = async (latitude, longitude) => {
    try {
      const token = "my_secret_token_12345"; // Replace with the actual token
      const response = await axios.post('http://192.168.153.57:3000/update-location', {
        latitude,
        longitude,
        token,
      });
      console.log('Location sent to server:', response.data);
    } catch (error) {
      console.error('Error sending location to server:', error);
      Alert.alert('Error', 'Failed to send location to server.');
    }
  };

  let content;
  if (loading) {
    content = <Image source={logo} style={styles.logo} />;
  } else {
    let text = 'Waiting...';
    if (location) {
      text = `Latitude: ${location.coords.latitude}; Longitude: ${location.coords.longitude}`;
    } else if (errorMsg) {
      text = errorMsg;
    }
    content = <Text style={styles.paragraph}>{text}</Text>;
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ImageBackground source={logo} style={styles.logoBackground} />
      ) : (
        <>
          {content}
          <Button
            title={isSharing ? "Stop Sharing" : "Start Sharing"}
            onPress={isSharing ? stopSharing : startSharing}
          />
          {location && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
              >
                <Image
                  source={require('./assets/location.png')}
                  style={styles.busIcon}
                />
              </Marker>
            </MapView>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
  },
  logoBackground: {
    flex: 0,
    width: '100%',
    height: '58 %',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  busIcon: {
    width: 50,
    height: 50,
  },
});