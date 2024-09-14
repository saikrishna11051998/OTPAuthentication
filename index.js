import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from '../config'; // Adjust path if needed
import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';

import { AppRegistry } from 'react-native';
import App from '../App';
import { name as appName } from '../app.json';

AppRegistry.registerComponent(appName, () => App);



const Otp = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);

  const sendVerification = () => {
    
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      // const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneProvider
           .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
           .then(setVerificationId);
           setPhoneNumber('');
  };

  const confirmCode = () => {
   
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        code
      );
       firebase.auth().signInWithCredential(credential)
      .then(() => {
        setCode('');
      })
      .catch((error) =>{
        alert(error);
      });
      Alert.alert('Login Successful', 'Welcome to the dashboard',
      );
    } 
  

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
      <Text style={styles.otpText}>Login using OTP</Text>
      <TextInput
        placeholder='Phone Number with country code'
        onChangeText={setPhoneNumber}
        keyboardType='phone-pad'
        autoCompleteType='tel'
        style={styles.textInput}
        value={phoneNumber}
      />
      <TouchableOpacity style={styles.sendVerification} onPress={sendVerification}>
        <Text style={styles.buttonText}>Send verification</Text>
      </TouchableOpacity>
      <TextInput
        placeholder='Confirm code'
        onChangeText={setCode}
        keyboardType='number-pad'
        style={styles.textInput}
        value={code}
      />
      <TouchableOpacity style={styles.sendCode} onPress={confirmCode}>
        <Text style={styles.buttonText}>Confirm verification</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Otp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    fontSize: 24,
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  sendVerification: {
    padding: 20,
    backgroundColor: '#3498db',
    borderRadius: 10,
  },
  sendCode: {
    padding: 20,
    backgroundColor: '#9b59b6',
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  otpText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    margin: 20,
  },
});


