import React, { Component } from 'react'
import {View, Text, FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux';
import {setListBookmark, setSelectPage} from '../../actions/actions'
import {getAsyncStorage, setAsyncStorage} from '../../util/BaseUtil'

class BookmarkScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            select_tab: 0,
            isLongClickItemList: false,
        }
    }

    componentDidMount(){
        try {
            setTimeout(() => {
                getAsyncStorage("BOOK_MARK_CALCULATE_2").then((list_bookmark) => {
                    if(list_bookmark != null){
                        this.props.setListBookmark(list_bookmark)
                    }
                })
            }, 100);
        } catch (error) {}
    }

    setSelectTab(val){
        if(val != this.state.select_tab){
            this.props.setListBookmark([]);
            this.setState({
                select_tab: val,
            })
            if(val == 2){
                setTimeout(() => {
                    getAsyncStorage("BOOK_MARK_CALCULATE_2").then((list_bookmark) => {
                        if(list_bookmark != null){
                            this.props.setListBookmark(list_bookmark)
                        }
                    })
                }, 100);
            }
        }
    }

    setColorForTab(val){
        if(val == this.state.select_tab){
            return "#214263"
        } else {
            return "#132c44"
        }
    }

    onClickItem(item){
        if(this.state.isLongClickItemList){
            this.setState({
                isLongClickItemList: false,
            })
        } else {
            this.props.setSelectPage(-1);
            this.props.navigation.navigate('DetailListChart', {data_send: {symbol: item.symbol, symbolName: item.symbolName}});
        }
    }

    onLongClickItem(item){
        this.setState({
            isLongClickItemList: true,
        })
    }

    onClickRemove(val){
        try {
            let list_remove = this.props.list_bookmark.filter(elm => elm.symbol !== val);
            if(list_remove.length > 0){
                setAsyncStorage("BOOK_MARK_CALCULATE_2", JSON.stringify(list_remove));
                this.props.setListBookmark(list_remove)
            }
        } catch (error) {}
    }

    renderItemList(item){
        return <TouchableOpacity 
            style={styles.item_list_touchable}
            onPress={()=>{this.onClickItem(item)}}
            onLongPress={() => {this.onLongClickItem(item)}}
        >
            <Text style={styles.item_list_text}>{item.datetime}</Text>
            <View style={{flexDirection: "row", height: "100%", alignItems: "center"}}>
                <Text style={styles.item_list_text}>{item.symbolName}</Text>
                { this.state.isLongClickItemList && <TouchableOpacity 
                    style={{width: 30, height: 20, marginLeft: 20, justifyContent: "center", alignItems: "center"}}
                    onPress={()=> {this.onClickRemove(item.symbol)}}
                >
                    <Image
                        style={{ width: 20, height: 20, resizeMode: "contain" }}
                        source={require("../../assets/images/ic_royaln_bin.png")}
                    />
                </TouchableOpacity>}
            </View>
        </TouchableOpacity>
    }

    render(){
        return(
            <View style={styles.contain}>
                <View style={styles.tab_bar_view}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            width: "100%",height: "100%", 
                            justifyContent: "center", 
                            alignItems: "center",
                            backgroundColor: this.setColorForTab(2),
                        }}
                        onPress={() => {this.setSelectTab(2);}}
                    >
                        <Image
                            style={{ width: 20, height: 20 }}
                            source={require('../../assets/images/ic_royaln_calculate_2.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{width: "100%", height: "100%"}}>
                    <FlatList
                        style={styles.contain_list}
                        data = {this.props.list_bookmark}
                        renderItem={({item}) => (
                            this.renderItemList(item)
                        )}
                        keyExtractor={item => item.symbol}
                    />
                </View>
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

    tab_bar_view: {
        flexDirection: "row",
        width: "100%", height: 40, 
        backgroundColor: "#132c44",
        justifyContent: "space-between",
    },

    contain_list: {
        width: "100%",
        height: "100%",
        backgroundColor: "#214263",
    },

    item_list_touchable: {
        flexDirection: "row", 
        width: "100%", height: 50, 
        padding: 10, 
        justifyContent: "space-between", 
        borderBottomWidth: 0.5, 
        borderBottomColor: "#132c44"
    },

    item_list_text: {
        fontSize: 20, 
        fontWeight: "bold", 
        color: "#fff"
    },
})

function mapStateToProps(state){
    return{
        list_bookmark: state.KC.list_bookmark,
        select_hour: state.KC.select_hour,
    };
}

const mapDispatchToProps = dispatch => ({
    setListBookmark: (val) => dispatch(setListBookmark(val)),
    setSelectPage: (val) => dispatch(setSelectPage(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkScreen);