import React, { Component } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import {checkPass} from '../util/BaseUtil'
import {connect} from 'react-redux';
import {setIntervalReadData} from '../actions/actions'

class LoginScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            pass: "",
            style_login: 0,
        }
    }

    onTextChange(val){
        this.setState({
            pass: val,
        })
    }

    onClickLogin(){
        checkPass(this.state.pass).then(pass => {
            if(pass){
                this.setState({
                    style_login: 1,
                })
                this.props.setIntervalReadData();
                this.props.navigation.replace('Main');
            } else {
                this.setState({
                    style_login: 2,
                })
            }
        })
    }

    render(){
        return(
            <View style={{flex: 1, width: "100%", height: "100%", backgroundColor: "#132c44", justifyContent: "center", alignItems: "center"}}>
                <View style={{flexDirection: "column", width: "100%", height: "60%", alignItems: "center", justifyContent: "space-between"}}>
                    <Text style={{color: "#fff", fontSize: 30, fontWeight: "bold"}}>ROYALN</Text>
                    { this.state.style_login > 0 && <Text style={{color: "#fff"}}>{(this.state.style_login == 2) ? "Login failed" : "Login success"}</Text>}
                    <View style={{flexDirection: "column", width: "100%", padding: "10%"}}> 
                        <View style={{width: "100%", height: 45, backgroundColor: "#fff", borderRadius: 20, paddingLeft: 10, paddingRight: 10}}>
                            <TextInput
                                style={{width: "100%"}}
                                keyboardType='default' 
                                onChangeText={text => this.onTextChange(text)}
                                placeholder="Password"
                                placeholderTextColor="#aaaaaaaa"
                                value={this.state.pass}
                            />
                        </View>
                        <TouchableOpacity
                            style={{width: "100%", height: 45, marginTop: 20, backgroundColor: "#214263", borderRadius: 20, justifyContent: "center", alignItems: "center"}}
                            onPress={() => this.onClickLogin()}
                        >
                            <Text style={{color: "#fff", fontWeight: "bold"}}>LOGIN</Text>
                        </TouchableOpacity>
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
    // getData_firebase_for_calculate: () => dispatch(getData_firebase_for_calculate()),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);