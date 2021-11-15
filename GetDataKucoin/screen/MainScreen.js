import React, { Component } from 'react'
import {View, Text, TouchableOpacity, TextInput} from 'react-native'
import {
    onActionBackgroundService, 
    onStopBackgroundService, 
    getDataRealTime, 
    requesData24h, 
    pushDataToFirebaseTest
} from './BackgroundAction'
import {setAsyncStorage, getAsyncStorage} from './BaseScreen'

import {firebaseApp} from './FirebaseDatabaseApp'
import auth from '@react-native-firebase/auth';
import {na, pa} from './BackgroundAction'

class MainScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            selectTime: 60,
            backgroundActionIsEnable: false,
            myVar: "",
            myVar24h: "",
            text_input: "",
        }
    }

    componentDidMount() {
        global.MyVar = "";
        global.MyVar24h = "";
        this.checkEnableBackgroundActions();
        setInterval(() => {
            this.setMyVar(global.MyVar);
            this.setMyVar24h(global.MyVar24h);
        }, 1000);
    }

    setMyVar(val){
        this.setState({
            myVar: val,
        })
    }

    setMyVar24h(val){
        this.setState({
            myVar24h: val,
        })
    }

    checkEnableBackgroundActions(){
        getAsyncStorage('KC_Get_Data').then((val) => {
            if(val === "true"){
                this.setState({
                    backgroundActionIsEnable: true,
                })
            } else {
                this.setState({
                    backgroundActionIsEnable: false,
                })
            }
        })
    }

    setValueS(val){
        this.setState({
            value: val,
        })
    }

    onClickAutoGetData(val){
        if(val){
            this.onStopBackgroundAction();
        } else {
            this.onStartBackgroundAction();
        }   
    }

    onStartBackgroundAction(){
        onActionBackgroundService();
        setAsyncStorage('KC_Get_Data', "true");
        this.setState({
            backgroundActionIsEnable: true,
        })
    }
    
    onStopBackgroundAction(){
        onStopBackgroundService();
        setAsyncStorage('KC_Get_Data', "false");
        this.setState({
            backgroundActionIsEnable: false,
        })
    }

    setBCForButtonAutoGetData(){
        return this.state.backgroundActionIsEnable ? "#555fff" : "#bbbbbb";
    }

    setBCForSelectTime(val){
        return (this.state.selectTime == val) ? "#555fff" : "#bbbbbb";
    }

    request_data_1h(){
        if (!firebaseApp.apps.length) {
            firebaseApp.initializeApp({});
        }else {
            firebaseApp.app();
        }
        auth()
        .signInWithEmailAndPassword(na, pa)
        .then(() => {
            // console.log('signed in OK');
            getDataRealTime((new Date()));
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
            }

            console.error("Quang Error: " + error);
        });
    }

    request_data_24h(){
        if (!firebaseApp.apps.length) {
            firebaseApp.initializeApp({});
        }else {
            firebaseApp.app();
        }
        auth()
        .signInWithEmailAndPassword(na, pa)
        .then(() => {
            // console.log('signed in OK');
            requesData24h()
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
            }

            console.error("Quang Error: " + error);
        });
    }
    
    render() {
        return (
            <View style={{flex: 1, flexDirection: "column", width: "100%", height: "100%", padding: 20, alignItems: "center", backgroundColor: "#555fff"}}>
                <Text style={{flex: 1,fontSize: 30, fontWeight: "bold", color: "#ffffff", marginTop: 50}}>ROYALN GET DATA KC</Text>
                <View style={{flex: 9, flexDirection: "column", width: "100%", height: "100%"}}>

                    <View style={{width: "100%", height: 50, flexDirection: 'row', marginTop: 20, backgroundColor: "#ffffff", padding: 10, borderRadius: 10, justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={{fontSize: 18, fontWeight: "bold"}}>Enable auto get data</Text>
                        <TouchableOpacity 
                            style={{width: 50, height: 24, backgroundColor: this.setBCForButtonAutoGetData(), borderRadius: 12}}
                            onPress={() => this.onClickAutoGetData(this.state.backgroundActionIsEnable)}
                        >
                            {
                                this.state.backgroundActionIsEnable === true
                                ?   <View style={{flexDirection: "row", justifyContent: "space-between", padding: 2}}>
                                        <View style={{width: 20, height: 20, backgroundColor: "#ffffff00", borderRadius: 10}}/>
                                        <View style={{width: 20, height: 20, backgroundColor: "#ffffff", borderRadius: 10}}/>
                                    </View>
                                :   <View style={{flexDirection: "row", justifyContent: "space-between", padding: 2}}>
                                        <View style={{width: 20, height: 20, backgroundColor: "#ffffff", borderRadius: 10}}/>
                                        <View style={{width: 20, height: 20, backgroundColor: "#ffffff00", borderRadius: 10}}/>
                                    </View>
                            }
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{flexDirection: "column", width: "100%", marginTop: 20, padding: 10, backgroundColor: "#ffffff", borderRadius: 10}}>
                        <Text style={{fontSize: 18, fontWeight: "bold"}}>Information</Text>
                        <Text style={{fontSize: 15, fontWeight: "bold", color: "#aaaaaa"}}>- Auto get data is {"" + this.state.backgroundActionIsEnable}.</Text>
                        <Text style={{fontSize: 15, fontWeight: "bold", color: "#aaaaaa"}}>- Select time auto get data is {this.state.selectTime} {(this.state.selectTime == 1) ? "day" : "minutes"}.</Text>
                    </View>

                    <View style={{flexDirection: "column", width: "100%", marginTop: 20, padding: 10, backgroundColor: "#dddddd", borderRadius: 10}}>
                        <Text style={{fontSize: 15, fontWeight: "bold"}}>{"Status process 1h: " + this.state.myVar}</Text>
                    </View>

                    <TouchableOpacity
                        style={{width: "100%", height: 45, marginTop: 20, borderRadius: 10, backgroundColor: "#ffffff", justifyContent: "center", alignItems: "center"}}
                        onPress={() => {this.request_data_1h()}}
                    >
                        <Text style={{color: "#000000", fontWeight: "bold"}}>Reques Data 1h</Text>
                    </TouchableOpacity>

                    <View style={{flexDirection: "column", width: "100%", marginTop: 20, padding: 10, backgroundColor: "#dddddd", borderRadius: 10}}>
                        <Text style={{fontSize: 15, fontWeight: "bold"}}>{"Status process 24h: " + this.state.myVar24h}</Text>
                    </View>

                    <TouchableOpacity
                        style={{width: "100%", height: 45, marginTop: 20, borderRadius: 10, backgroundColor: "#ffffff", justifyContent: "center", alignItems: "center"}}
                        onPress={() => {this.request_data_24h()}}
                    >
                        <Text style={{color: "#000000", fontWeight: "bold"}}>Reques Data 24h</Text>
                    </TouchableOpacity>

                    {/* <TextInput
                        style={{width: "100%", backgroundColor: "#fff", borderRadius: 10,  marginTop: 20}}
                        value={this.state.text_input}
                        onChangeText={(text) => {this.setState({text_input: text})}}
                    /> */}

                    {/* <TouchableOpacity
                        style={{width: "100%", height: 45, marginTop: 5, borderRadius: 10, backgroundColor: "#ffffff", justifyContent: "center", alignItems: "center"}}
                        onPress={() => {this.testAuthentication()}}
                    >
                        <Text style={{color: "#000000", fontWeight: "bold"}}>Test Button</Text>
                    </TouchableOpacity> */}
                </View>
                <Text style={{position: "absolute", bottom: 10, right: 10, color: "#fff"}}>Create new by @ Royaln - version 1.0</Text>
            </View>
        );
    }
}

export default MainScreen;