import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const App = () => {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/buses')
      .then(response => response.json())
      .then(data => setBuses(data))
      .catch(error => console.error('Error fetching bus data:', error));
  }, []);

  return (
    <View>
      {buses.map(bus => (
        <View key={bus.id}>
          <Text>{`Bus ID: ${bus.id}, Route: ${bus.route}, Location: (${bus.latitude}, ${bus.longitude})`}</Text>
        </View>
      ))}
    </View>
  );
};

export default App;
