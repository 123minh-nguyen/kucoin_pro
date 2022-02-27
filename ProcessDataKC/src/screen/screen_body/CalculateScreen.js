import React, { Component } from 'react'
import {View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert} from 'react-native'
import {connect} from 'react-redux';
import {
    setIsLoading,
    calculaing_data_qualified,
} from '../../actions/actions'
import {roundNumber, getDateTime, getIdByDateTime, getAsyncStorage, setAsyncStorage} from '../../util/BaseUtil'

class CalculateScreen extends Component{
    constructor(props){
        super(props);
    }

    showAlert(){
        Alert.alert(
            "",
            "List data is saved!",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }

    componentDidMount(){
        this.props.setIsLoading(true);
        this.props.calculaing_data_qualified();
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

    onClickSave(val){
        if(val.length > 0){
            var list_bookmark = [];
            try {
                getAsyncStorage("BOOK_MARK_CALCULATE_2").then((list_data) => {
                    getDateTime().then((datetime) => {
                        if(list_data != null) {
                            list_bookmark = list_data.reverse();
                        }
                        val.forEach(elm => {
                            if(list_bookmark.length > 0){
                                if(list_bookmark.some(item => (item.symbol + "") === (elm.symbol + ""))){
                                    
                                } else {
                                    list_bookmark.push({datetime: datetime, symbol: elm.symbol, symbolName: elm.symbolName});
                                }
                            } else {
                                list_bookmark.push({datetime: datetime, symbol: elm.symbol, symbolName: elm.symbolName});
                            }
                        })
                        setAsyncStorage("BOOK_MARK_CALCULATE_2", JSON.stringify(list_bookmark.reverse()));
                        this.showAlert();
                    })
                })
            } catch (error) {}
        }
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
        </TouchableOpacity>
    }

    render(){
        return(
            <View style={{
                flexDirection: "column",
                width: "100%",
                height: "100%",
                backgroundColor: "#214263"
            }}>
                <View style={styles.contain}>
                    <View style={styles.contain_view_header_list}>
                        <Text style={styles.contain_view_header_list_text}>{this.props.list_calculaing_data_qualified.length}</Text>
                    </View>
                    <FlatList
                        style={styles.contain_list}
                        data = {this.props.list_calculaing_data_qualified}
                        renderItem={({item}) => (
                            this.renderItemList(item)
                        )}
                        keyExtractor={item => item.symbol}
                    />
                </View>

                { this.props.list_calculaing_data_qualified.length > 0 && <TouchableOpacity 
                    style={styles.contain_touch}
                    onPress={()=>{this.onClickSave(this.props.list_calculaing_data_qualified);}}
                >
                    <Image
                        style={{ width: 25, height: 25 }}
                        source={require('../../assets/images/ic_royaln_save.png')}
                    />
                </TouchableOpacity>}
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

    contain_view_header_list:{
        flexDirection: "row", 
        width: "100%", height: 25, 
        paddingRight: 10, 
        backgroundColor: "#132c44", 
        borderTopColor: "#132944", 
        borderBottomColor: "#aaaaaa", 
        borderBottomWidth: 0.5, 
        borderTopWidth: 0.5, 
        justifyContent: "flex-end", 
        alignItems: "center"
    },

    contain_view_header_list_text:{
        fontSize: 11, 
        fontWeight: "bold", 
        color: "#fff"
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

    contain_touch:{
        width: 40, height: 40, 
        backgroundColor: "#ffffff20", 
        bottom: 15, 
        right: 15,
        position: "absolute",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ffffffaa",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 10,
        elevation: 3,
    },
})

function mapStateToProps(state){
    return{
        isLoading: state.KC.isLoading,
        list_calculaing_data_qualified: state.KC.list_calculaing_data_qualified,
    };
}

const mapDispatchToProps = dispatch => ({
    setIsLoading: (val) => dispatch(setIsLoading(val)),
    calculaing_data_qualified: () => dispatch(calculaing_data_qualified()),
})

export default connect(mapStateToProps, mapDispatchToProps)(CalculateScreen);