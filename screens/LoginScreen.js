import React, { useState } from 'react';
import { View, Text, TextInput,Image, TouchableOpacity, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  const handleLogin = () => {
    navigation.navigate('Map');
  };

  return (
    <View style={styles.container}>
<Image
        source={require('../assets/Card-Orange.png')}style={styles.tigerr}
    
      />


      <View style={styles.loginContainer}>
        
        <Text style={styles.title}>Welcome </Text>
        
        
        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={name}
          onChangeText={setName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Id"
          value={id}
          onChangeText={setId}
          secureTextEntry
        />

    

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover',
    paddingHorizontal: 30,
    backgroundColor: 'white',
  },
  loginContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    
  },
  tigerr:{
   width: '35%',
   height:'10%',
    marginBottom: 10,
    borderRadius: 0,
  },

  
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'orange',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: 'orange',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
  },

  button: {
    backgroundColor: 'orange',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
 
});

export default LoginScreen;
