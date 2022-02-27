import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, FlatList} from 'react-native'
import {connect} from 'react-redux';
import {
    getDataDetail, 
    getDataDetail_24h, 
    setListDetailListChart, 
    setSelectPage,
    setIsLoading,
} from '../../../actions/actions'
import {roundNumber} from '../../../util/BaseUtil'

class DetailListChart extends Component{
    constructor(props){
        super(props);

        this.state = {
            loading: "."
        }
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

    componentDidMount(){
        this.props.setIsLoading(true);
        this.props.navigation.setOptions({ title: this.props.route.params.data_send.symbolName});
        
        if(this.props.select_hour == 0){
            this.props.getDataDetail(this.props.route.params.data_send.symbol);
        } else {
            this.props.getDataDetail_24h(this.props.route.params.data_send.symbol)
        }

        setInterval(() => {
            if(this.state.loading.length > 3){
                this.setState({
                    loading: ".",
                })
            } else {
                this.setState({
                    loading: this.state.loading + ".",
                })
            }
        }, 700);
    }

    componentWillUnmount(){
        this.props.setSelectPage(1);
        this.props.setListDetailListChart([]);
    }

    renderItemList(item){
        return <View style={styles.contain_item}>
            <View style={{flexDirection: "row",width: "100%", height: 23, justifyContent: "space-between", alignItems: "center"}}>
                <Text style={{color: "#fff", fontSize: 18, fontWeight: "bold"}}>{item.date_time}</Text>
                <View style={{flexDirection: "row", height: "100%"}}>
                    { item.list_calculator.some(elm => elm == 1) && <Image
                        style={{ width: 50, height: 20 }}
                        source={require('../../../assets/images/ic_royaln_support_up.png')}
                        resizeMode={"contain"}
                    />}
                    { item.list_calculator.some(elm => elm == 2) && <Image
                        style={{ width: 50, height: 20 }}
                        source={require('../../../assets/images/ic_royaln_support_down.png')}
                        resizeMode={"contain"}
                    />}
                    { item.list_calculator.some(elm => elm == 3) && <Image
                        style={{ width: 50, height: 20 }}
                        source={require('../../../assets/images/ic_royaln_consecutive_increase.png')}
                        resizeMode={"contain"}
                    />}
                    { item.list_calculator.some(elm => elm == 4) && <View style={{flexDirection: "row", width: 50, height: "100%", justifyContent: "center"}}>
                        <Image
                            style={{ width: 20, height: 20 }}
                            source={require('../../../assets/images/ic_royaln_support_up.png')}
                        />
                        <Image
                            style={{ width: 20, height: 20 }}
                            source={require('../../../assets/images/ic_royaln_consecutive_increase.png')}
                        />
                    </View>}
                    { item.list_calculator.some(elm => elm == 5) && <View style={{flexDirection: "row", width: 50, height: "100%", justifyContent: "center"}}>
                        <Image
                            style={{ width: 20, height: 20 }}
                            source={require('../../../assets/images/ic_royaln_support_down.png')}
                        />
                        <Image
                            style={{ width: 20, height: 20 }}
                            source={require('../../../assets/images/ic_royaln_consecutive_increase.png')}
                        />
                    </View>}
                </View>
            </View>
            <View 
                style={styles.contain_item_chart}
            >
                <View style={styles.contain_item_contain_pair}>
                    <Text style={styles.contain_item_contain_pair_text_name}>{item.symbolName.substring(0, item.symbolName.length - 4)}</Text>
                    <Text style={[styles.contain_item_contain_pair_text_name, {color: this.setColorForChangeRate(item.changeRate)}]}>{roundNumber((item.changeRate * 100), 2)}%</Text>
                    <Text style={[styles.contain_item_contain_change_valValue_text_volValue]}>{roundNumber(item.volValue, 3)}</Text>
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
            </View>
        </View>
    }

    render(){
        return(
            <View style={styles.contain}>
                <FlatList
                    style={styles.contain_list}
                    data = {this.props.list_detail_list_chart}
                    renderItem={({item}) => (
                        this.renderItemList(item)
                    )}
                    keyExtractor={item => item.date_time}
                />
                {this.props.isLoading && <View style={{width: "100%", height: "100%", position: "absolute", justifyContent: "center", alignItems: "center"}}>
                    <View style={{width: 200, height: 70, borderRadius: 10, backgroundColor: "#000000A0", justifyContent: "center", alignItems: "center"}}>
                        <Text style={{width: 100, color: "#fff", fontSize: 18, fontWeight: "bold"}}>Loading {this.state.loading}</Text>
                    </View>
                </View>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contain: {
        width: "100%",
        height: "100%",
        backgroundColor: "#214263"
    },

    contain_list: {
        backgroundColor: "#214263"
    },

    contain_item:  {
        flexDirection: "column", 
        width: "100%",  
        height: 140, 
        paddingLeft: 10,
        paddingRight: 10,
    },

    contain_item_chart: {
        flexDirection: "row", 
        width: "100%",
        height: 110, 
        borderBottomWidth: 0.4, 
        borderBottomColor: "#aaaaaa", 
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
        list_detail_list_chart: state.KC.list_detail_list_chart,
        select_hour: state.KC.select_hour,
        isLoading: state.KC.isLoading,
    };
}

const mapDispatchToProps = dispatch => ({
    getDataDetail: (val) => dispatch(getDataDetail(val)),
    getDataDetail_24h: (val) => dispatch(getDataDetail_24h(val)),
    setListDetailListChart: (val) => dispatch(setListDetailListChart(val)),
    setSelectPage: (val) => dispatch(setSelectPage(val)),
    setIsLoading: (val) => dispatch(setIsLoading(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DetailListChart);