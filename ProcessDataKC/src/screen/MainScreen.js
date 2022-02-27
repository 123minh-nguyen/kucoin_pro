import React, { Component } from 'react'
import {View, Text, Image, TouchableOpacity, TextInput, AppState} from 'react-native'
import {connect} from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screen_body/HomeScreen'
import ListChart from './screen_body/ListChartScreen'
import Calculate from './screen_body/CalculateScreen'
import Qualified from './screen_body/QualifiedScreen'
import Bookmark from './screen_body/BookmarkScreen'
import {
    setSearchText, 
    setSelectSearch, 
    setSelectPage, 
    refreshListCalculateChart, 
    setSelectHour, 
    setListCalculateChart,
    getQuickData,
    getQuikData_24h,
    clearDataCalculate,
} from '../actions/actions'


const Tab = createBottomTabNavigator();

function IconHome(props) {
    return (
        <View style={{
            flexDirection: "column", 
            width: "100%", height: "100%", 
            justifyContent: "center", 
            alignItems: "center"}}
        >
            <Image
                style={{ width: 20, height: 20 }}
                source={require('../assets/images/ic_royaln_home.png')}
            />
            { props.focused && <Text style={{fontSize: 10, color: "#ffffff"}}>Home</Text>}
        </View>
    );
}

function IconListChar(props) {
    return (
        <View style={{
            flexDirection: "column", 
            width: "100%", height: "100%", 
            justifyContent: "center", 
            alignItems: "center"}}
        >
            <Image
                style={{ width: 20, height: 20 }}
                source={require('../assets/images/ic_royaln_chart.png')}
            />
            { props.focused && <Text style={{fontSize: 10, color: "#ffffff"}}>Chart</Text>}
        </View>
    );
}

function IconCalculate(props) {
    return (
        <View style={{
            flexDirection: "column", 
            width: "100%", height: "100%", 
            justifyContent: "center", 
            alignItems: "center"}}
        >
            <Image
                style={{ width: 20, height: 20 }}
                source={require('../assets/images/ic_royaln_calculate_2.png')}
            />
            { props.focused && <Text style={{fontSize: 10, color: "#ffffff"}}>Calculate</Text>}
        </View>
    );
}

function IconBookmark(props) {
    return (
        <View style={{
            flexDirection: "column", 
            width: "100%", height: "100%", 
            justifyContent: "center", 
            alignItems: "center"}}
        >
            <Image
                style={{ width: 20, height: 20 }}
                source={require('../assets/images/ic_royaln_new.png')}
            />
            { props.focused && <Text style={{fontSize: 10, color: "#ffffff"}}>Bookmark</Text>}
        </View>
    );
}

class MainScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            appState: AppState.currentState
        }
    }

    componentDidMount(){
        this.customHeaderRightButton();
    }

    componentDidUpdate(){
        this.customHeaderRightButton();
    }

    setStyleForSwitchHour(val){
        if(this.props.select_hour == val){
            return "#fff"
        } else {
            return "#aaaaaaaa"
        }
    }

    onClickSelectoHour(){
        this.props.setListCalculateChart(null);
        this.props.clearDataCalculate();
        
        if(this.props.select_hour == 0){
            this.props.setSelectHour(1);
            this.props.getQuikData_24h();
        } else {
            this.props.setSelectHour(0);
            this.props.getQuickData();
        }
    }

    customHeaderRightButton(){
        this.props.navigation.setOptions({ 
            headerRight: () => (
                this.props.select_page == 1
                ?   <View style={{flexDirection: "row", height: "100%", alignItems: "center"}}>
                        <View style={{width: 70, height: 30, marginRight: 10, borderRadius: 15, backgroundColor: "#214263",}}>
                            <TouchableOpacity 
                                style={{
                                    flexDirection: "row", 
                                    width: "100%", height: "100%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                onPress={() => {this.onClickSelectoHour()}}
                            >
                                <Text style={{color: this.setStyleForSwitchHour(0), fontSize: 15, fontWeight: "bold"}}>1h</Text>
                                <Text style={{color: "#fff", fontSize: 15}}>/</Text>
                                <Text style={{color: this.setStyleForSwitchHour(1), fontSize: 15, fontWeight: "bold"}}>24h</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {!this.props.select_search && <TouchableOpacity 
                            style={{width: 30, height: 30, justifyContent: "center", marginRight: 10, alignItems: "center"}}
                            onPress={() => {this.onClickSearch()}}
                        >
                            <Image
                                style={{width: 20, height: 20, resizeMode: "contain"}}
                                source={require('../assets/images/ic_royaln_search.png')}
                            />
                        </TouchableOpacity>}
                        {this.props.select_search && <View style={{flexDirection: "row", height: 30, backgroundColor: "#214263", marginRight: 10, borderRadius: 7, justifyContent: "center", alignItems: "center"}}>
                            <TextInput
                                style={{width: 100, fontSize: 15, color: "#fff", marginLeft: 3, paddingVertical: 0}}
                                keyboardType='default' 
                                onChangeText={text => this.onTextChange(text)}
                                placeholder="search"
                                placeholderTextColor="#aaaaaaaa"
                                value={this.props.search_filter}
                            />
                            <TouchableOpacity 
                                style={{marginLeft: 10, justifyContent: "center", alignItems: "center"}}
                                onPress={() => {this.onClickSearch()}}
                            >
                                <Image
                                    style={{width: 20, height: 20, marginLeft: 5, marginRight: 5, resizeMode: "contain"}}
                                    source={require('../assets/images/ic_royaln_close.png')}
                                />
                            </TouchableOpacity>
                        </View>}
                    </View>
                :   <View/>
                
            ),
        });
    }

    onClickSearch(){
        if(this.props.select_search){
            this.props.setSelectSearch(false);
            this.props.setSearchText("");
            setTimeout(() => {this.props.refreshListCalculateChart();}, 300);
        } else {
            this.props.setSelectSearch(true);
        }
    }

    onTextChange(val){
        this.props.setSearchText(val);
        this.props.refreshListCalculateChart();
    }

    render(){
        return(
            <View style={{width: "100%", height: "100%"}}>
                
                <Tab.Navigator
                    initialRouteName="Home"
                    tabBarOptions={{
                        style: {
                            backgroundColor: "#132c44",
                            borderTopWidth: 0,
                        },
                        showLabel: false,
                    }}    
                >
                    <Tab.Screen 
                        name="Home" 
                        component={Home} 
                        options={{
                            tabBarIcon: props => <IconHome {...props} />,
                        }}
                        listeners={({ navigation, route }) => ({
                            tabPress: e => {
                                this.props.setSelectPage(0);
                            },
                        })}
                    />
                    <Tab.Screen 
                        name="ListChar" 
                        component={ListChart} 
                        options={{
                            tabBarIcon: props => <IconListChar {...props} />, 
                        }}
                        listeners={({ navigation, route }) => ({
                            tabPress: e => {
                                this.props.setSelectPage(1);
                            },
                        })}
                    />
                    <Tab.Screen 
                        name="Calculate" 
                        component={Calculate} 
                        options={{
                            tabBarIcon: props => <IconCalculate {...props} />, 
                        }}
                        listeners={({ navigation, route }) => ({
                            tabPress: e => {
                                this.props.setSelectPage(3);
                            },
                        })}
                    />
                    <Tab.Screen 
                        name="Bookmark" 
                        component={Bookmark} 
                        options={{
                            tabBarIcon: props => <IconBookmark {...props} />, 
                        }}
                        listeners={({ navigation, route }) => ({
                            tabPress: e => {
                                this.props.setSelectPage(4);
                            },
                        })}
                    />
                </Tab.Navigator>
            </View>
        )
    }
}

function mapStateToProps(state){
    return{
        select_search: state.KC.select_search,
        search_filter: state.KC.search_filter,
        select_page: state.KC.select_page,
        select_hour: state.KC.select_hour,
    };
}

const mapDispatchToProps = dispatch => ({
    setSelectSearch: (val) => dispatch(setSelectSearch(val)),
    setSearchText: (val) => dispatch(setSearchText(val)),
    setSelectPage: (val) => dispatch(setSelectPage(val)),
    setSelectHour: (val) => dispatch(setSelectHour(val)),
    refreshListCalculateChart: () => dispatch(refreshListCalculateChart()),
    setListCalculateChart: (val) => dispatch(setListCalculateChart(val)),
    getQuickData: () => dispatch(getQuickData()),
    getQuikData_24h: () => dispatch(getQuikData_24h()),
    clearDataCalculate: () => dispatch(clearDataCalculate()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);