import React, { Component } from 'react'
import {View, Text} from 'react-native'
import {connect} from 'react-redux';
import {setIntervalReadData} from '../actions/actions'

class FlashScreen extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        // this.props.setIntervalReadData();
        setTimeout(() => {
            this.props.navigation.replace('Login');
        }, 2000);
    }

    render(){
        return(
            <View style={{
                flex: 1,
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#132c44", 
            }}>
                <Text style={{
                    color: "#fff",
                    fontSize: 30,
                    fontWeight: "bold"
                }}>
                    ROYALN
                </Text>
                <View style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    position: "absolute",
                }}>
                    <View style={{
                        width: 230,
                        height: 25
                    }}>
                        <Text style={{
                            color: "#fff",
                            fontSize: 13,
                        }}>
                            Create new by @ROYALN - version 3.0
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

function mapStateToProps(state){
    return{
        // total_item: state.KC.total_item,
    };
}

const mapDispatchToProps = dispatch => ({
    setIntervalReadData: () => dispatch(setIntervalReadData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(FlashScreen);