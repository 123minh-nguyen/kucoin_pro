import 'react-native-gesture-handler';
import React from 'react';
import type {Node} from 'react';
import {StatusBar, Text, View, LogBox} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './src/screen/MainScreen'
import Flash from './src/screen/FlashScreen'
import Login from './src/screen/LoginScreen'
import Detail from './src/screen/screen_body/DetailBookmark'
import DetailListChart from './src/screen/screen_body/ListChartDetail/DetailListChart' 

import { Provider } from 'react-redux';
import { createStore, applyMiddleware} from 'redux';
import rootReducer from './src/reducer/combineReducers';
import thunk from 'redux-thunk';

const store = createStore(rootReducer, applyMiddleware(thunk));

const Stack = createStackNavigator();

const App: () => Node = () => {
  LogBox.ignoreLogs(['Reanimated 2']);
  return (
    <Provider store={ store }>
      <View style={{flex: 1, width: "100%", height: "100%", backgroundColor: "#132c44"}}>
        <StatusBar translucent={false} backgroundColor={"#132c44"} barStyle={"light-content"}/>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Flash"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#132c44',
              },
              backgroundColor: "#132c44"
            }}
          >
            <Stack.Screen 
              name="Flash" 
              options={{
                title: 'Flash',
                headerShown: false,
              }}
              component={Flash}
            />
            <Stack.Screen 
              name="Login" 
              options={{
                title: 'Login',
                headerShown: false,
              }}
              component={Login}
            />
            <Stack.Screen 
              name="Main" 
              options={{
                title: 'ROYALN',
                headerTitleStyle: {
                  color: "#fff",
                  fontWeight: "bold"
                },
                headerStyle: {
                  backgroundColor: '#132c44',
                  elevation: 0,
                  shadowOpacity: 0,
                  borderBottomWidth: 0,
                },
              }}
              component={Main}
            />
            <Stack.Screen 
              name="Detail" 
              options={{
                title: 'DATE SAVE',
                headerTitleStyle: {
                  color: "#fff",
                  fontWeight: "bold"
                },
                headerStyle: {
                  backgroundColor: '#132c44',
                  elevation: 0,
                  shadowOpacity: 0,
                  borderBottomWidth: 0,
                },
                headerTintColor: "#fff"
              }}
              component={Detail}
            />
            <Stack.Screen 
              name="DetailListChart" 
              options={{
                title: '',
                headerTitleStyle: {
                  color: "#fff",
                  fontWeight: "bold"
                },
                headerStyle: {
                  backgroundColor: '#132c44',
                  elevation: 0,
                  shadowOpacity: 0,
                  borderBottomWidth: 0,
                },
                headerTintColor: "#fff"
              }}
              component={DetailListChart}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </Provider>
  );
};

export default App;
