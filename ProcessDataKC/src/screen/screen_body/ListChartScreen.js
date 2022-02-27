import React, { Component } from 'react'
import {View, Text, Image, FlatList, TouchableOpacity, StyleSheet} from 'react-native'
import {connect} from 'react-redux';
import {roundNumber} from '../../util/BaseUtil'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import NullLayoutForTopNavigation from './NullLayoutForTopNavigationScreen'
import {
    setSelectSort, 
    refreshListCalculateChart, 
    setSelectPage, 
    getQuickData, 
    getQuikData_24h
} from '../../actions/actions'

const Tab = createMaterialTopTabNavigator();

class ListChartScreen extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        setTimeout(() => {
            this.props.refreshListCalculateChart();
        }, 500);
    }

    setColorForChangeRate(val){
        if(val < 0){
            return "#ed4242"
        } else if(val == 0) {
            return "#7f7f7f"
        } else {
            return "#00bf5f"
        }
    }

    setColorForChart(val){
        if(val < 0){
            return "#ed4242";
        } else {
            return "#00bf5f";
        }
    }

    setHeightForChart(max, val){
        val = val ?? 0;
        val = (val < 0 ? val * (-1) : val)/max;
        if(val > 0 && val < 0.02){
            val = 0.01;
        }
        let percen = roundNumber((val * 100), 2);
        if(percen == 100){
            percen = 99;
        }
        return percen + "%";
    }

    setHeightForCenterChart(max, val){
        try{
            let percen = roundNumber(((val < 0 ? val * (-1) : val)/max) * 100, 2);
            return (percen == 0 ? 1 : percen) + "%";
        } catch (e) {
            return "1%";
        }
    }

    setColorForSortTab(val){
        if(this.props.select_sort == val){
            return "#ffffff";
        } else {
            return "#aaaaaa50";
        }
    }

    onClickSort(){
        if(this.props.select_sort == 1){
            this.props.setSelectSort(2);
        } else if(this.props.select_sort == 2){
            this.props.setSelectSort(3);
        } else if(this.props.select_sort == 3){
            this.props.setSelectSort(4);
        } else {
            this.props.setSelectSort(1);
        }

        if(this.props.select_hour == 0){
            this.props.getQuickData();
        } else {
            this.props.getQuikData_24h();
        }
    }

    goToDetail(val){
        this.props.setSelectPage(-1);
        this.props.navigation.navigate('DetailListChart', {data_send: val});
    }

    renderItemList(item){
        return <TouchableOpacity 
            style={styles.contain_item}
            onPress={() => {
                this.goToDetail({symbol: item.symbol, symbolName: item.symbolName})
            }}
        >
            <View style={styles.contain_item_contain_pair}>
                <Text style={styles.contain_item_contain_pair_text_name}>{item.symbolName.substring(0, item.symbolName.length - 4)}</Text>
                <Text style={[styles.contain_item_contain_pair_text_name, {color: this.setColorForChangeRate(item.changeRate)}]}>{roundNumber((item.changeRate * 100), 2)}%</Text>
                <View style={styles.contain_item_contain_change_valValue_view_volValue}>
                    <Text style={styles.contain_item_contain_change_valValue_text_volValue}>{roundNumber(item.volValue, 3)}</Text>
                    <Text style={styles.contain_item_contain_change_valValue_text_volValue}>{item.count_qualified}</Text>
                </View>
                <Text style={styles.contain_item_contain_max_min_price_max}>{item.high}</Text>
                <Text style={[styles.contain_item_contain_change_valValue_text_change, {color: this.setColorForChangeRate(item.changeRate)}]}>{item.last}</Text>
                <Text style={styles.contain_item_contain_max_min_price_min}>{item.low}</Text>
                
            </View>
            <View style={styles.contain_item_contain_chart_2}>
                <View style={styles.contain_item_contain_chart_2_2}>
                    {   item.list_change_rate.map((item_chart, key) => { 
                            return <View key={key} style={styles.contain_item_contain_chart_view}>
                                <View style={[styles.contain_item_contain_chart_view_view, {height: this.setHeightForChart(item_chart.max_height, (item_chart.height_top < 0 ? 0 : item_chart.height_top))}]}/>
                                <View style={[styles.contain_item_contain_chart_view_view, {height: this.setHeightForCenterChart(item_chart.max_height, item_chart.height_center), backgroundColor: this.setColorForChart(item_chart.price_current)}]}/>
                                <View style={[styles.contain_item_contain_chart_view_view, {height: this.setHeightForChart(item_chart.max_height, item_chart.height_bottom)}]}/>
                            </View>
                        })
                    }
                </View>
            </View>
        </TouchableOpacity>
    }

    render(){
        return(
            <View style={styles.contain}>
                <View style={{flexDirection: "row",width: "100%", height: 30, backgroundColor: "#132c44", justifyContent: "space-between"}}>
                    <Tab.Navigator
                        initialRouteName="UP"
                        tabBarOptions={{
                            activeTintColor: '#fff',
                            style: {
                                height: 33,
                                backgroundColor: "#132c44",
                                marginTop: 3,
                                borderTopWidth: 0
                            },
                            showLabel: false,
                            showIcon: true,
                            tabStyle: { width: 100, borderTopWidth: 0 },
                            
                        }} 
                    >
                        <Tab.Screen 
                            name="UP" 
                            component={NullLayoutForTopNavigation}
                            options={{
                                marginLeft: -10,
                                tabBarIcon: () => {
                                    return (
                                        <View style={{
                                            flexDirection: "row",
                                            width: 100, height: "100%",
                                            marginLeft: -27,
                                            marginTop: -3,
                                        }}
                                        >
                                            <Text style={{fontSize: 10, color: this.setColorForSortTab(1)}}>Pair</Text>
                                            <Text style={{fontSize: 10, color: "#fff"}}>/</Text>
                                            <Text style={{fontSize: 10, color: this.setColorForSortTab(2)}}>Change</Text>
                                            <Text style={{fontSize: 10, color: "#fff"}}>/</Text>
                                            <Text style={{fontSize: 10, color: this.setColorForSortTab(3)}}>Vol</Text>
                                            <Text style={{fontSize: 10, color: "#fff"}}>/</Text>
                                            <Text style={{fontSize: 10, color: this.setColorForSortTab(4)}}>Qlf</Text>
                                            <Image
                                                style={{ width: 10, height: 10, marginTop: 2 }}
                                                source={require('../../assets/images/ic_royaln_up_down.png')}
                                            />
                                        </View>
                                    );
                                },
                            }}
                            listeners={({ navigation, route }) => ({
                                tabPress: e => {
                                    this.onClickSort();
                                },
                            })}
                        />
                    </Tab.Navigator>
                    <Text style={{color: "#ffffff", marginTop: 12, marginRight: 15, fontSize: 11, fontWeight: "bold"}}>{(this.props.list_calculate_chart == null) ? "Loading..." : this.props.list_calculate_chart.length}</Text>
                </View>
                <FlatList
                    style={styles.contain_list}
                    data = {this.props.list_calculate_chart}
                    renderItem={({item}) => (
                        this.renderItemList(item)
                    )}
                    keyExtractor={item => item.symbol}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contain: {
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#214263"
    },

    contain_list: {
        backgroundColor: "#214263"
    },

    contain_item: {
        flexDirection: "row", 
        width: "94%", 
        marginLeft: "3%", 
        height: 110, 
        borderBottomWidth: 0.4, 
        borderBottomColor: "#132c44", 
        alignItems: "center"
    },

    contain_item_contain_pair: {
        flex: 1, 
        flexDirection: "column", 
        height: "100%", 
        justifyContent: "center"
    },

    contain_item_contain_pair_text_name:{
        fontWeight: "bold", 
        color: "#dddddd"
    },

    contain_item_contain_pair_text_price: {
        width: "100%", 
        fontSize: 10, 
        color: "#aaaaaa"
    },

    contain_item_contain_chart:{
        flex: 1, 
        flexDirection: "row", 
        height: "100%", 
        padding: 3,
        justifyContent: "center", 
        alignItems: "flex-end"
    },

    contain_item_contain_chart_2: {
        flex: 3, height: "90%", backgroundColor: "#132c44", borderRadius: 5, borderColor: "#aaaaaa", borderWidth: 0.5
    }, 

    contain_item_contain_chart_2_2: {
        width: "100%", height: "100%", flexDirection: "row", padding: 3
    },

    contain_item_contain_chart_view: {
        flex: 1, flexDirection: "column", marginLeft: 0.25, marginRight: 0.25, height: "100%"
    },

    contain_item_contain_chart_view_view: {
        width: "100%"
    },

    contain_item_contain_change_valValue:{
        flex: 1, 
        flexDirection: "column",
        justifyContent: "center",
    },

    contain_item_contain_change_valValue_text_change: {
        fontSize: 12,
        fontWeight: "bold"
    },

    contain_item_contain_change_valValue_view_volValue: {
        flexDirection: "row", 
        width: "100%", 
        justifyContent: "space-between", 
        paddingRight: 5
    },

    contain_item_contain_change_valValue_text_volValue: {
        fontSize: 12,
        color: "#aaaaaa",
    },



    contain_item_contain_max_min_price: {
        flex: 1, 
        flexDirection: "column", 
        height: "100%", 
        justifyContent: "center"
    },

    contain_item_contain_max_min_price_max: {
        width: "100%", 
        fontSize: 10, 
        color: "#e87204", 
    }, 

    contain_item_contain_max_min_price_min: {
        width: "100%", 
        fontSize: 10, 
        color: "#bf00bf",
    },

    contain_item_contain_chart_line_background:{
        position: "absolute", 
        width: 1, height: "100%", 
        backgroundColor: "#aaaaaa30", 
        alignSelf: "center"
    },

    contain_item_contain_chart_line_background_1:{
        flexDirection: "column", 
        width: "100%", height: "100%", 
        position: "absolute", 
        justifyContent: "space-around", 
        margin: 3
    },

    contain_item_contain_chart_line_background_2:{
        width: "100%", height: 1, 
        backgroundColor: "#aaaaaa30"
    },
})

function mapStateToProps(state){
    return{
        list_calculate_chart: state.KC.list_calculate_chart,
        select_sort: state.KC.select_sort,
        select_hour: state.KC.select_hour,
    };
}

const mapDispatchToProps = dispatch => ({
    setSelectPage: (val) => dispatch(setSelectPage(val)),
    setSelectSort: (val) => dispatch(setSelectSort(val)),
    refreshListCalculateChart: () => dispatch(refreshListCalculateChart()),
    getQuickData: () => dispatch(getQuickData()),
    getQuikData_24h: () => dispatch(getQuikData_24h()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ListChartScreen);