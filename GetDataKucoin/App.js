import React from 'react';
import type {Node} from 'react';
import {
  Text,
  View,
  StatusBar,
  StyleSheet,
} from 'react-native';
import MainScreen from './screen/MainScreen'

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent={true} backgroundColor={backgroundColor} {...props} />
  </View>
);

const App: () => Node = () => {
  return (
    <View style={{flex: 1, width: "100%", height: "100%",backgroundColor: "#ffffff"}}>
      <MyStatusBar backgroundColor="#000000A0" barStyle="light-content" />
      <MainScreen/>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    height: 0,
  },
});

export default App;

// Library

// Firebase database
// https://rnfirebase.io
// https://rnfirebase.io/database/usage

// Background actions
// https://github.com/Rapsssito/react-native-background-actions

// Async Storage
// https://react-native-async-storage.github.io/async-storage/docs/install/
// ==> npm install @react-native-async-storage/async-storages
// ==> react-native link @react-native-async-storage/async-storage