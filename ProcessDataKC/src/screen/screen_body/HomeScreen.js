import React, { Component } from 'react'
import {View, Text, StyleSheet, FlatList} from 'react-native'
import {roundNumber} from '../../util/BaseUtil'
import {readDataFromFirebase_24h} from '../../actions/actions_24h'
import {connect} from 'react-redux';

class HomeScreen extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        setTimeout(() => {this.props.readDataFromFirebase_24h();}, 2000);
    }

    setColorForTap(val){
        if(this.state.select_tap == val){
            return "#132c44";
        } else {
            return "#00000000";
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

    filter_listData(listData){
        return listData.sort((a, b) => a.changeRate < b.changeRate).slice(0, 20);
    }

    render(){
        return(
            <View style={styles.contain_view}>
                <FlatList
                    data = {this.filter_listData(this.props.listData)}
                    renderItem={({item}) => (
                        <View style={styles.contain_item}>
                            <View style={styles.contain_item_contain_pair}>
                                <Text style={styles.contain_item_contain_pair_text_name}>{item.symbolName.substring(0, item.symbolName.length - 4)}</Text>
                                <Text style={styles.contain_item_contain_pair_text_price}>{item.last}</Text>
                            </View>
                            <View style={styles.contain_item_contain_change_valValue}>
                                <Text style={[styles.contain_item_contain_change_valValue_text_change, {color: this.setColorForChangeRate(item.changeRate)}]}>{roundNumber((item.changeRate * 100), 2)}%</Text>
                                <Text style={[styles.contain_item_contain_change_valValue_text_volValue]}>{roundNumber(item.volValue, 3)}</Text>
                            </View>
                            <View style={styles.contain_item_contain_max_min_price}>
                                <Text style={styles.contain_item_contain_max_min_price_max}>{item.high}</Text>
                                <Text style={styles.contain_item_contain_max_min_price_min}>{item.low}</Text>
                            </View>
                        </View>
                    )}
                    keyExtractor={item => item.symbol}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contain_view: {
        width: "100%",
        height: "100%",
        backgroundColor: "#214263"
    },

    contain_item: {
        flexDirection: "row", 
        width: "94%", 
        marginLeft: "3%", 
        height: 50, 
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

    contain_item_contain_change_valValue:{
        flex: 1, 
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },

    contain_item_contain_change_valValue_text_change: {
        fontSize: 12
    },

    contain_item_contain_change_valValue_text_volValue: {
        fontSize: 12,
        color: "#aaaaaa"
    },

    contain_item_contain_max_min_price: {
        flex: 1, 
        flexDirection: "column", 
        height: "100%", 
        justifyContent: "center"
    },

    contain_item_contain_max_min_price_max: {
        width: "100%", 
        fontSize: 12, 
        color: "#e87204", 
        textAlign: "right"
    }, 

    contain_item_contain_max_min_price_min: {
        width: "100%", 
        fontSize: 12, 
        color: "#bf00bf", 
        textAlign: "right"
    },
})

function mapStateToProps(state){
    return{
        listData: state.KC.listData,
    };
}

const mapDispatchToProps = dispatch => ({
    readDataFromFirebase_24h: () => dispatch(readDataFromFirebase_24h()),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);