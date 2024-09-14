import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Home = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
    })();
  }, []);

  const shareLocation = async () => {
    if (!hasLocationPermission) {
      Alert.alert('Permission required', 'Location permission is required to share your location.');
      return;
    }

    try {
      const { coords } = await Location.getCurrentPositionAsync();
      const userId = firebase.auth().currentUser.uid;
      const userDocRef = firebase.firestore().collection('users').doc(userId);

      // Update user location in Firestore
      await userDocRef.update({
        location: new firebase.firestore.GeoPoint(coords.latitude, coords.longitude),
      });

      // Notify the friend
      await notifyFriend(userId, coords.latitude, coords.longitude);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to share location.');
    }
  };

  const notifyFriend = async (userId, latitude, longitude) => {
    try {
      // Get the friend's user ID from Firestore
      const friendSnapshot = await firebase.firestore().collection('users').doc(userId).collection('friends').get();
      
      friendSnapshot.forEach(async (doc) => {
        const friendData = doc.data();
        const friendPhoneNumber = friendData.phoneNumber;
        
        // Find the friend's user document
        const friendUserSnapshot = await firebase.firestore().collection('users').where('phoneNumber', '==', friendPhoneNumber).get();
        
        friendUserSnapshot.forEach(async (friendDoc) => {
          const friendDeviceToken = friendDoc.data().deviceToken; // Ensure deviceToken is stored in Firestore

          // Send a notification to the friend
          await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'key=YOUR_SERVER_KEY' // Replace with your FCM server key
            },
            body: JSON.stringify({
              to: friendDeviceToken,
              notification: {
                title: 'Location Shared',
                body: `Your friend is sharing their location. Click to view.`,
                sound: 'default'
              },
              data: {
                latitude: latitude.toString(),
                longitude: longitude.toString(),
                action: 'view_location' // Custom action to handle in your app
              }
            })
          });
        });
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to notify friend.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Page</Text>
      <Button title="Share Location" onPress={shareLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    width:400,
    
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Home;
