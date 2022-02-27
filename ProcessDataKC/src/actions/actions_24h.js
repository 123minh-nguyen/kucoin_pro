import {Alert} from 'react-native'
import {firebaseApp} from '../util/FirebaseDatabaseApp'
import {
    getDateTimeOneLastHour, 
    calculate_percent_height,
    get_date_time_by_hour, 
    get_date_time_one_day
} from '../util/BaseUtil'

export const list_data_firebase_24h = (val) => ({
    type: 'SET_LIST_DATA_FIREBASE_24H',
    listData_firebase_24h: val
})

export const list_calculate_nan_24h = (val) => ({
    type: 'SET_LIST_CALCULATE_NAN_24H',
    list_calculate_nan_24h: val
})

export const readDataFromFirebase_24h = () => {
    return async (dispatch, getState) => {
        try{
            var date = new Date();
            let year = "" + date.getFullYear();
            let month = (date.getMonth() + 1) > 9 ? ("" + (date.getMonth() + 1)) : ("0" + (date.getMonth() + 1));
            let day = date.getDate() > 9 ? ("" + date.getDate()) : ("0" + date.getDate());
            let path = '/dataKC_new_coin/' + year + '-' + month + '-' + day + '00:00';
            firebaseApp.database().ref(path).once('value', function (snapshot) {
                if(JSON.stringify(snapshot) == "null"){
                    Alert.alert(
                        "",
                        "I can't get data from firebase!",
                        [
                          {},
                          { text: "OK", onPress: () => console.log("OK Pressed") }
                        ]
                    );
                } else {
                    if(snapshot.val().data.length > 0){
                        var list = JSON.parse(snapshot.val().data);
                        list.forEach(element => {
                            element.list_change_rate = element.list_change_rate.reverse();
                        })
                        dispatch(list_data_firebase_24h(list));
                        setTimeout(() => {
                            dispatch(convert_list_data_24h());
                        }, 1000);
                    }
                }
            })
        } catch (e){
            
        }
    }  
}

export const convert_list_data_24h = () => {
    return async (dispatch, getState) => {
        try{
            var list_data = [];
            var obj_old = {};
            getState().KC.listData.forEach(element => {
                obj_old = (getState().KC.listData_firebase_24h.filter(el => (el.symbol + "") === (element.symbol + "")))[0];
                if(obj_old != null && obj_old != undefined){
                    list_data.push({
                        symbol: element.symbol, 
                        symbolName: element.symbolName, 
                        last: element.last,
                        changeRate: (element.last - obj_old.last)/(obj_old.last == 0 ? 1 : obj_old.last),
                        list_change_rate: calculate_percent_height(obj_old.list_change_rate, (element.last - obj_old.last)/(obj_old.last == 0 ? 1 : obj_old.last)),
                        volValue: element.volValue,
                        high: element.high,
                        low: element.low,   
                        count_qualified: 0,             
                    })
                }
            });
            dispatch(count_qualified_list_data_24h(list_data));
        } catch (e){}
    }
}

export const count_qualified_list_data_24h = (list_data) => {
    return (dispatch, getState) => {
        var count_qualified = 0;
        var count_columm_increase = 0;
        var count_not_columm_increase = 0;
        list_data.forEach(element => {
            for(var i = 0; i < element.list_change_rate.length; i++){
                if(element.list_change_rate[i].height_center >= 0){
                    if(count_not_columm_increase > 1){
                        count_not_columm_increase = 0;
                    }
                    count_columm_increase++;
                } else {
                    count_not_columm_increase++;
                    if(count_not_columm_increase > 1){
                        count_columm_increase = 0;
                    }
                }

                if(count_columm_increase > 4){
                    count_columm_increase = 0;
                    count_not_columm_increase = 0;
                    count_qualified++;
                }
                
            }
            element.count_qualified = count_qualified;
            count_columm_increase = 0;
            count_not_columm_increase = 0;
            count_qualified = 0;
        })
        dispatch(calculateConsecutive5ColummIncrease_24h(list_data));
    }
}

export const calculateConsecutive5ColummIncrease_24h = (list) => {
    return (dispatch, getState) => {
        var list_consecutive_increase = [];
        var count_columm_increase = 1;
        var count_qualified = 0;
        var qualified = false;
        list.forEach(element => {
            for(var i = (element.list_change_rate.length - 1); i > ((element.list_change_rate.length - 1)/2); i--){
                try {
                    if(element.list_change_rate[i].height_center >= 0 && count_columm_increase < 5){
                        if(i < (element.list_change_rate.length - 1)){
                            if(element.list_change_rate[i+1].height_center >= 0){
                                count_columm_increase++;
                            } else {
                                count_columm_increase = 1;
                            }
                        }
                    } else {
                        count_columm_increase = 1;
                    }

                    if(count_columm_increase > 4){
                        let height_increase = (element.list_change_rate[i + 4].height_center + element.list_change_rate[i + 4].height_bottom)/element.list_change_rate[i + 4].max_height;
                        let height_current = ((element.list_change_rate[element.list_change_rate.length - 1].height_center < 0 ? (element.list_change_rate[element.list_change_rate.length - 1].height_center * -1) : element.list_change_rate[element.list_change_rate.length - 1].height_center) + element.list_change_rate[element.list_change_rate.length - 1].height_bottom)/element.list_change_rate[element.list_change_rate.length - 1].max_height;
                        if((height_increase - height_current) < 0.2){
                            // khoản cách của cây tăng và cây hiện tại không được vượt quá 20% 
                            
                            qualified = true;
                        }
                        count_columm_increase = 1;
                    }

                    if(i == (element.list_change_rate.length + 1)/2){
                        if(qualified){
                            list_consecutive_increase.push(element);
                        }
                        qualified = false;
                        break;
                    }
                } catch (error) { }
            }
        })
        dispatch(list_calculate_nan_24h(list_consecutive_increase));
    }
}