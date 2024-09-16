import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const LocationScreen = ({ route }) => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const latitude = route?.params?.latitude ?? 0;
  const longitude = route?.params?.longitude ?? 0;

  // Function to request location permissions
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This app needs to access your location.',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasLocationPermission(true);
        } else {
          console.warn('Location permission denied');
        }
      } else {
        // iOS location permissions can be handled via the Info.plist file
        setHasLocationPermission(true); // Assume permission is granted for simplicity
      }
    } catch (err) {
      console.warn('Error requesting location permission:', err);
    }
  };

  // Request location permission on component mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Handle case where location permission is denied
  if (!hasLocationPermission) {
    return (
      <View style={styles.container}>
        <Text>Location permission is required to display the map.</Text>
      </View>
    );
  }

  if (!route?.params) {
    return (
      <View style={styles.container}>
        <Text>No location data provided.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={{ latitude: parseFloat(latitude), longitude: parseFloat(longitude) }} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
});

export default LocationScreen;
