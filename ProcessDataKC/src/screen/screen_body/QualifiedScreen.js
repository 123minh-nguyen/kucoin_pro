import React, { Component } from 'react'
import {View, Image} from 'react-native'
import {connect} from 'react-redux';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ChartUp from './CalculateChildScreen/ChartUpScreen'
import ChartDown from './CalculateChildScreen/ChartDownScreen'
import ChartNan from './CalculateChildScreen/ChartNanScreen'
import ChartUpNan from './CalculateChildScreen/ChartUpNanScreen'
import ChartDownNan from './CalculateChildScreen/ChartDownNanScreen'

const Tab = createMaterialTopTabNavigator();

function IconUp(props) {
    return (
        <View style={{
            width: "100%", height: "100%", 
            justifyContent: "center", 
            alignItems: "center"}}
        >
            <Image
                style={{ width: 20, height: 20 }}
                source={require('../../assets/images/ic_royaln_support_up.png')}
            />
        </View>
    );
}

function IconDown(props) {
    return (
        <View style={{
            width: "100%", height: "100%", 
            justifyContent: "center", 
            alignItems: "center"}}
        >
            <Image
                style={{ width: 20, height: 20 }}
                source={require('../../assets/images/ic_royaln_support_down.png')}
            />
        </View>
    );
}

function IconNan(props) {
    return (
        <View style={{
            width: "100%", height: "100%", 
            justifyContent: "center", 
            alignItems: "center",
        }}
        >
            <Image
                style={{ width: 20, height: 20 }}
                source={require('../../assets/images/ic_royaln_consecutive_increase.png')}
            />
        </View>
    );
}

function IconUpNan(props) {
    return (
        <View style={{
            flexDirection: "row",
            width: "100%", height: "100%", 
            justifyContent: "center", 
            alignItems: "center"}}
        >
            <Image
                style={{ width: 20, height: 20 }}
                source={require('../../assets/images/ic_royaln_support_up.png')}
            />
            <Image
                style={{ width: 20, height: 20 }}
                source={require('../../assets/images/ic_royaln_consecutive_increase.png')}
            />
        </View>
    );
}

function IconDownNan(props) {
    return (
        <View style={{
            flexDirection: "row",
            width: "100%", height: "100%", 
            justifyContent: "center", 
            alignItems: "center"}}
        >
            <Image
                style={{ width: 20, height: 20 }}
                source={require('../../assets/images/ic_royaln_support_down.png')}
            />
            <Image
                style={{ width: 20, height: 20 }}
                source={require('../../assets/images/ic_royaln_consecutive_increase.png')}
            />
        </View>
    );
}

class QualifiedScreen extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={{
                flexDirection: "column",
                width: "100%",
                height: "100%",
                backgroundColor: "#214263"
            }}>
                <View style={{width: "100%", height: "100%"}}>
                    <Tab.Navigator
                        initialRouteName="UP"
                        tabBarOptions={{
                            style: {
                                height: 43,
                                width: "100%",
                                backgroundColor: "#132c44",
                                marginTop: -3
                            },
                            showLabel: false,
                            showIcon: true,
                        }} 
                    >
                        <Tab.Screen 
                            name="UP" 
                            component={ChartUp}
                            options={{
                                tabBarIcon: props => <IconUp {...props} />,
                            }}
                        />
                        <Tab.Screen 
                            name="DOWN"  
                            component={ChartDown}
                            options={{
                                tabBarIcon: props => <IconDown {...props} />,
                            }}
                        />
                        <Tab.Screen 
                            name="NAN"  
                            component={ChartNan}
                            options={{
                                tabBarIcon: props => <IconNan {...props} />,
                            }}
                        />
                        <Tab.Screen 
                            name="UPNAN"  
                            component={ChartUpNan}
                            options={{
                                tabBarIcon: props => <IconUpNan {...props} />,
                            }}
                        />
                        <Tab.Screen 
                            name="DOWNNAN"  
                            component={ChartDownNan}
                            options={{
                                tabBarIcon: props => <IconDownNan {...props} />,
                            }}
                        />
                    </Tab.Navigator>
                </View>
            </View>
        )
    }
}

export default connect(null, null)(QualifiedScreen);