import React from 'react'
import BackgroundService from 'react-native-background-actions';
import {firebaseApp} from './FirebaseDatabaseApp'
import {getIdByDateTime, getDateTimeLastOneHour, getDateTimeToRemoveDatebase, getDateTime, getAsyncStorage, get_date_time_by_hour} from './BaseScreen'

import auth from '@react-native-firebase/auth';
// const delaym = ms => new Promise(res => setTimeout(res, ms));
export const na = 'nguyenminhquang1993@gmail.com';
export const pa = 'quang@123';

const veryIntensiveTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;
    await new Promise( async (resolve) => {
        try{
            setInterval(function () {
                let date = new Date();
                if (date.getMinutes() == 0) { 
                    if (!firebaseApp.apps.length) {
                        firebaseApp.initializeApp({});
                    }else {
                        firebaseApp.app();
                    }
                    auth()
                    .signInWithEmailAndPassword(na, pa)
                    .then(() => {
                        // console.log('signed in OK');
                        getDataRealTime(date);
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
            }, 60000);
        } catch (e){
            console.log(e);
        }
    });
};

const filterData = (val) => {
    return val.filter(el => el.symbol.indexOf('-BTC') > 0 ).sort((a, b) => a.symbolName > b.symbolName);
}

export const getDataRealTime = async(date) => {
    try{
        global.MyVar = "Processing data!";
        let response = await fetch(
            'https://api.kucoin.com/api/v1/market/allTickers',
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            }
        );
        let json = await response.json();
        // Send data to Firebase ......
        if(json.code == "200000"){
            sendDataToFirebase_1h(json);
            if (date.getHours() == 0 && date.getMinutes() == 0) { 
                sendDataToFirebase_24h(json);
            }
        }
    } catch (e){ }
}

export const requesData24h = async() => {
    try{
        global.MyVar24h = "Processing data!";
        let response = await fetch(
            'https://api.kucoin.com/api/v1/market/allTickers',
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            }
        );
        let json = await response.json();
        // Send data to Firebase ......
        if(json.code == "200000"){
            sendDataToFirebase_24h(json);
        }
    } catch (e){ }
}

const addItemToList = (item, list) => {
    var list_new = [item].concat(list);
    if(list_new.length > 100){
        list_new.pop();
    }
    return list_new;
}

const greateNewListChangeRate = () => {
    var list_change = [0];
    for(var i = 0; i < 100; i++){
        list_change.push(0);
    }
    if(list_change.length > 100){
        list_change.length = 100;
    }
    return list_change;
}

const getPercent = (num_new, num_old) => {
    if(num_new < num_old){
        return (((num_old - num_new)/num_new) * -1);
    } else {
        return ((num_new - num_old)/num_old);
    }
}

const sendDataToFirebase_1h = (json) => {
    get_data_1h().then((list_data_firebase_1h) => {
        if(list_data_firebase_1h !== "respon error" && ("" + list_data_firebase_1h) !== "null"){
            
            let listData = filterData(json.data.ticker);
            var list_data = [];
            var list_new_symbol = [];
            listData.forEach(element => {
                let obj_old = JSON.parse(list_data_firebase_1h.data).filter(el => (el.symbol + "") === (element.symbol + ""))[0];
                    
                if((new Date()).getHours() != 0){
                    list_new_symbol = JSON.parse(list_data_firebase_1h.new_symbol);
                }
                
                if(obj_old != null && obj_old != undefined){
                    list_data.push({
                        symbol: element.symbol, 
                        symbolName: element.symbolName, 
                        last: element.last,
                        changeRate: getPercent(element.last, obj_old.last),
                        list_change_rate: addItemToList(getPercent(element.last, obj_old.last), obj_old.list_change_rate),
                        volValue: element.volValue - obj_old.volValue,
                        high: element.high,
                        low: element.low,                
                    })
                } else {
                    list_data.push({
                        symbol: element.symbol, 
                        symbolName: element.symbolName, 
                        last: element.last, 
                        changeRate: 0,
                        list_change_rate: greateNewListChangeRate(),
                        volValue: element.volValue,
                        high: element.high,
                        low: element.low,                
                    });

                    list_new_symbol.push(element.symbolName);
                }
            });
            
            pushDataToFirebase_1h({
                time_server: getDateTime(),
                new_symbol: JSON.stringify(list_new_symbol),
                data: JSON.stringify(list_data.sort((a, b) => a.symbolName > b.symbolName))
            });

            checkListQualified(list_data);
        }
    })
}

const sendDataToFirebase_24h = (json) => {
    get_data_24h().then((list_data_firebase_24h) => {
        if(list_data_firebase_24h !== "respon error" && ("" + list_data_firebase_24h) !== "null"){
            
            let listData = filterData(json.data.ticker);
            var list_data = [];
            listData.forEach(element => {
                let obj_old = JSON.parse(list_data_firebase_24h.data).filter(el => (el.symbol + "") === (element.symbol + ""))[0];
                
                if(obj_old != null && obj_old != undefined){
                    list_data.push({
                        symbol: element.symbol, 
                        symbolName: element.symbolName, 
                        last: element.last,
                        changeRate: getPercent(element.last, obj_old.last),
                        list_change_rate: addItemToList(getPercent(element.last, obj_old.last), obj_old.list_change_rate),
                        volValue: element.volValue - obj_old.volValue,
                        high: element.high,
                        low: element.low,                
                    })
                } else {
                    list_data.push({
                        symbol: element.symbol, 
                        symbolName: element.symbolName, 
                        last: element.last, 
                        changeRate: 0,
                        list_change_rate: greateNewListChangeRate(),
                        volValue: element.volValue,
                        high: element.high,
                        low: element.low,                
                    });
                }
            });
            
            pushDataToFirebase_24h({
                time_server: getDateTime(),
                data: JSON.stringify(list_data.sort((a, b) => a.symbolName > b.symbolName))
            });
        }
    })
}

const pushDataToFirebase_1h = (val) => {
    getIdByDateTime().then(id => {
        let path = '/dataKC/' + id.substring(0, 10) + '/' + id.substring(10);
        // console.log('val: ' + JSON.stringify(val.new_symbol));
        firebaseApp.database().ref(path)
        .set(val)
        .then(() => {
            console.log('Data updated.');
            global.MyVar = "Data is updated.!";
            removeDatabase30DayAgo();
        });
    })
}

export const checkListQualified = (list_data) => {
    var max_height = 0;
    var count_elm = 0;
    var position_max = 0;
    var list_qualified = [];
    list_data.forEach(element => {
        for(var i = 0; i < element.list_change_rate.length; i++){
            if(max_height < (element.list_change_rate[i] < 0 ? (element.list_change_rate[i] * -1) : element.list_change_rate[i])){
                max_height = (element.list_change_rate[i] < 0 ? (element.list_change_rate[i] * -1) : element.list_change_rate[i]);
                position_max = i;
            }
        }
        if(position_max > 50){
            for(var j = 0; j < (position_max + 1); j++){
                if(((element.list_change_rate[j] < 0 ? (element.list_change_rate[j] * -1) : element.list_change_rate[j])/max_height) < 0.22 && element.list_change_rate[j] != 0){
                    count_elm++;
                }
            }
            if((count_elm/position_max) > 0.75  && max_height > 0){
                list_qualified.push(element.symbol);
            }
        }
        max_height = 0;
        position_max = 0;
        count_elm = 0;
    })
    
    // firebaseApp.database().ref('/dataKC_new_coin/qualified')
    // .set(JSON.stringify(list_qualified))
    // .then(() => console.log('Updated Qualified Success'));
}

export const onActionBackgroundService = async() => {
    // firebaseApp.initializeApp();
    await getAsyncStorage('KC_Select_Time').then((timeGetData) => {
        let options = {
            taskName: 'Kucoin Background Services',
            taskTitle: 'GET DATA KC',
            taskDesc: 'Geting data from KC website to Firebase every 60 minutes.',
            taskIcon: {
                name: 'ic_launcher',
                type: 'mipmap',
            },
            color: '#aaaaaa00',
            linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
            parameters: {
                delay: 60,
            },
        };
        BackgroundService.start(veryIntensiveTask, options);
    })
}

export const onStopBackgroundService = async() => {
    await BackgroundService.stop();
}

const get_data_1h = () => {
    return new Promise(async (resolve, reject) => {
        try{
            var next_type = false;
            var next_hour = 1;
            let my_interval = setInterval(() => {
                if(!next_type){
                    next_type = true;
                    get_date_time_by_hour(1, next_hour).then(time => {
                        readDataFromFirebase_1h(time[0]).then(list_data_firebase_1h => {
                            if(list_data_firebase_1h !== "respon error"){
                                clearInterval(my_interval);
                                resolve(list_data_firebase_1h);
                            } else {
                                next_hour++;
                            }
                            next_type = false;
                        })
                    });
                }
            }, 750);
        } catch (e){
            reject(e);
        }
    }) 
}

const readDataFromFirebase_1h = (time_1h) => {
    return new Promise(async (resolve, reject) => {
        try{
            var path_1h = '/dataKC/' + time_1h.substring(0, 10) + '/' + time_1h.substring(10);
            firebaseApp.database().ref(path_1h).once('value', function (snapshot) {
                if(JSON.stringify(snapshot) != "null" && snapshot != undefined){
                    if(snapshot.val().data.length > 0){
                        resolve(snapshot.val());
                    }
                } else {
                    resolve("respon error");
                }
            })
        } catch (e){
            reject(e);
        }
    }) 
}

const removeDatabase30DayAgo = () => {
    try{
        getDateTimeToRemoveDatebase().then(time => {
            let path = '/dataKC/' + time;
            firebaseApp.database().ref(path).remove();
        })
    } catch (e){ }
}

export const get_data_24h = () => {
    return new Promise(async (resolve, reject) => {
        try{
            var next_type = false;
            var next_hour = 24;
            let my_interval = setInterval(() => {
                if(!next_type){
                    next_type = true;
                    get_date_time_by_hour(1, next_hour).then(time => {
                        console.log("get_data_24h : " + JSON.stringify(time));
                        readDataFromFirebase_24h(time[0]).then(list_data_firebase_24h => {
                            if(list_data_firebase_24h !== "respon error"){
                                clearInterval(my_interval);
                                resolve(list_data_firebase_24h);
                            } else {
                                next_hour = next_hour + 24;
                            }
                            next_type = false;
                        })
                    });
                }
            }, 750);
        } catch (e){
            reject(e);
        }
    })
}

const readDataFromFirebase_24h = (time_24h) => {
    return new Promise(async (resolve, reject) => {
        try{
            var path_24h = '/dataKC_new_coin/' + time_24h.substring(0, 10) + '00:00';
            firebaseApp.database().ref(path_24h).once('value', function (snapshot) {
                if(JSON.stringify(snapshot) != "null" && snapshot != undefined){
                    if(snapshot.val().data.length > 0){
                        resolve(snapshot.val());
                    }
                } else {
                    resolve("respon error");
                }
            })
        } catch (e){
            reject(e);
        }
    }) 
}

const pushDataToFirebase_24h = (val) => {
    getIdByDateTime().then(id => {
        let path = '/dataKC_new_coin/' + id.substring(0, 10) + '00:00';
        firebaseApp.database().ref(path)
        .set(val)
        .then(() => {
            console.log('Data updated.');
            global.MyVar24h = "Data is updated.!";
        });
    })
}

export const pushDataToFirebaseTest = (val) => {
    global.MyVar = "Processing data!";
    get_data_24h();
}

