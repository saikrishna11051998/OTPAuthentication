import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet, Text } from 'react-native';
import React from 'react';

const LocationScreen = ({ route }) => {
  const latitude = route?.params?.latitude ?? 0;
  const longitude = route?.params?.longitude ?? 0;

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
