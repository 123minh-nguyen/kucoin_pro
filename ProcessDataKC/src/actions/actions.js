import {firebaseApp} from '../util/FirebaseDatabaseApp'
import {
    getDateTimeOneLastHour, 
    calculate_percent_height,
    get_date_time_by_hour, 
    get_date_time_one_day
} from '../util/BaseUtil'
import { Alert } from 'react-native'

export const isLoading = (val) => ({
    type: 'SET_IS_LOADING',
    isLoading: val
})

export const select_page = (val) => ({
    type: 'SET_SELECT_PAGE',
    select_page: val
})

export const select_search = (val) => ({
    type: 'SET_SELECT_SEARCH',
    select_search: val
})

export const search_filter = (val) => ({
    type: 'SET_FILTER_SEARCH',
    search_filter: val
})

export const select_sort = (val) => ({
    type: 'SET_SELECT_SORT',
    select_sort: val
})

export const select_hour = (val) => ({
    type: 'SET_SELECT_HOUR',
    select_hour: val
})

export const list_data = (val) => ({
    type: 'SET_LIST_DATA',
    listData: val
})

export const list_data_firebase = (val) => ({
    type: 'SET_LIST_DATA_FIREBASE',
    listData_firebase: val
})

export const list_data_convert = (val) => ({
    type: 'SET_LIST_DATA_CONVERT',
    listData_convert: val
})

export const list_calculate_chart = (val) => ({
    type: 'SET_LIST_CALCULATE_CHART',
    list_calculate_chart: val
})

export const list_calculate_up = (val) => ({
    type: 'SET_LIST_CALCULATE_UP',
    list_calculate_up: val
})

export const list_calculate_down = (val) => ({
    type: 'SET_LIST_CALCULATE_DOWN',
    list_calculate_down: val
})

export const list_calculate_nan = (val) => ({
    type: 'SET_LIST_CALCULATE_NAN',
    list_calculate_nan: val
})

export const list_calculate_nan_1h = (val) => ({
    type: 'SET_LIST_CALCULATE_NAN_1H',
    list_calculate_nan_1h: val
})

export const list_calculate_nan_24h = (val) => ({
    type: 'SET_LIST_CALCULATE_NAN_24H',
    list_calculate_nan_24h: val
})

export const list_calculate_up_nan = (val) => ({
    type: 'SET_LIST_CALCULATE_UP_NAN',
    list_calculate_up_nan: val
})

export const list_calculate_down_nan = (val) => ({
    type: 'SET_LIST_CALCULATE_DOWN_NAN',
    list_calculate_down_nan: val
})

export const list_bookmark = (val) => ({
    type: 'SET_LIST_BOOKMARK',
    list_bookmark: val
})

export const list_detail_list_chart = (val) => ({
    type: 'SET_LIST_DETAIL_LIST_CHART',
    list_detail_list_chart: val
})

export const list_calculaing_data_qualified = (val) => ({
    type: 'SET_LIST_CALCULATING_DATA_QUALIFIED',
    list_calculaing_data_qualified: val
})

export const setIsLoading = (val) => {
    return (dispatch, getState) => {
        dispatch(isLoading(val));
    }
}

export const setSelectPage = (val) => {
    return (dispatch, getState) => {
        dispatch(select_page(val));
    }
}

export const setSelectSearch = (val) => {
    return (dispatch, getState) => {
        dispatch(select_search(val));
    }
}

export const setSelectSort = (val) => {
    return (dispatch, getState) => {
        dispatch(select_sort(val));
    }
}

export const setSelectHour = (val) => {
    return (dispatch, getState) => {
        dispatch(select_hour(val));
        if(val == 1){

        }
    }
}

export const setSearchText = (val) => {
    return (dispatch, getState) => {
        dispatch(search_filter(val));
    }
}

export const setListBookmark = (val) => {
    return (dispatch, getState) => {
        dispatch(list_bookmark(val));
    }
}

export const setListDetailListChart = (val) => {
    return (dispatch, getState) => {
        dispatch(list_detail_list_chart(val));
    }
}

export const setListCalculateChart = (val) => {
    return (dispatch, getState) => {
        dispatch(list_calculate_chart(val));
    }
}

export const setIntervalReadData = () => {
    return (dispatch, getState) => {
        if(getState().KC.listData.length < 1){
            setInterval(() => {
                if(getState().KC.select_page > -1) {
                    dispatch(getData());
                    if(getState().KC.select_hour == 0){
                        dispatch(readDataFromFirebase());
                    }
                }
            }, 60000);
        }
        dispatch(getQuickData());
    }
}

export const getQuickData = () => {
    return (dispatch, getState) => {
        dispatch(getData());
        if(getState().KC.select_hour == 0){
            dispatch(readDataFromFirebase());
        }
    }
}

const filterData = (list_data, sort, select_search, text_search) =>{
    if(!select_search){
        if(sort == 1){
            list_data = list_data.sort((a, b) => a.symbolName > b.symbolName);
        } else if(sort == 2){
            list_data = list_data.sort((a, b) => a.changeRate < b.changeRate);
        } else if(sort == 3){
            list_data = list_data.sort((a, b) => (a.volValue * 1) < (b.volValue * 1));
        } else {
            list_data = list_data.sort((a, b) => a.count_qualified < b.count_qualified);
        }
    } else {
        if(text_search !== ""){
            list_data = list_data.filter(el => (("_" + el.symbolName).toUpperCase()).indexOf(("" + text_search).toUpperCase()) > 0);
        }
        list_data = list_data.sort((a, b) => a.symbolName > b.symbolName);
    }
    return list_data;
}

export const getData = () => {
    return async (dispatch, getState) => {
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
        let objData = (await response.json()).data.ticker.filter(el => el.symbol.indexOf('-BTC') > 0);
        dispatch(list_data(objData));
    }
}

export const readDataFromFirebase = () => {
    return async (dispatch, getState) => {
        try{
            var date = new Date();
            getDateTimeOneLastHour((date.getMinutes() == 0) ? 1 : 0).then((time) => {
                let path = '/dataKC/' + time.substring(0, 10) + '/' + time.substring(10)
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
                            dispatch(list_data_firebase(list));
                            setTimeout(() => {
                                dispatch(convert_list_data());
                            }, 200);
                        }
                    }
                })
            })
        } catch (e){
            
        }
    }  
}

export const convert_list_data = () => {
    return async (dispatch, getState) => {
        try{
            var list_data = [];
            var obj_old = {};
            getState().KC.listData.forEach(element => {
                obj_old = (getState().KC.listData_firebase.filter(el => (el.symbol + "") === (element.symbol + "")))[0];
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
            dispatch(count_qualified_list_data(list_data));
        } catch (e){}
    }
}

export const count_qualified_list_data = (list_data) => {
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
        dispatch(calculateConsecutive5ColummIncrease(list_data));
        dispatch(
            list_data_convert(
                filterData(
                    list_data, 
                    getState().KC.select_sort, 
                    null, 
                    null
                )
            )
        );
        dispatch(refreshListCalculateChart());
    }
}

export const refreshListCalculateChart = () => {
    return (dispatch, getState) => {
        if(getState().KC.select_search && getState().KC.search_filter !== ""){
            dispatch(
                list_calculate_chart(
                    filterData(
                        getState().KC.listData_convert, 
                        1, 
                        true, 
                        getState().KC.search_filter
                    )
                )
            );
        } else {
            dispatch(
                list_calculate_chart(
                    filterData(
                        getState().KC.listData_convert, 
                        getState().KC.select_sort, 
                        null, 
                        null
                    )
                )
            ); 
        }      
    }
}

export const calculateConsecutive5ColummIncrease = (list) => {
    return (dispatch, getState) => {
        var list_consecutive_increase = [];
        var count_columm_increase = 1;
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
        dispatch(list_calculate_nan(list_consecutive_increase));

        if(getState().KC.select_hour == 0){
            dispatch(list_calculate_nan_1h(list_consecutive_increase));
        } else {
            dispatch(list_calculate_nan_24h(list_consecutive_increase));
        }
    }
}

export const clearDataCalculate = () => {
    return (dispatch, getState) => {
        dispatch(list_calculate_nan([]));
        dispatch(setListBookmark([]));
        // dispatch(list_calculaing_data_qualified([]));
    }
}

export const getDataDetail = (symbol) => {
    return (dispatch, getState) => {
        get_date_time_by_hour(31, 24).then(list_date => {
            var i = 0;
            var next_type = false;
            let interval24 = setInterval(() => {
                if(!next_type){
                    next_type = true;
                    let path = '/dataKC/' + list_date[i];
                    firebaseApp.database().ref(path).once('value', function (snapshot) {
                        if(JSON.stringify(snapshot) != "null"){
                            try{
                                let obj_item = (JSON.parse(snapshot.val().data).filter(el => (el.symbol + "") === (symbol + "")))[0];
                                obj_item.list_change_rate = obj_item.list_change_rate.reverse();
                                dispatch(convert_data_detail({date_time: list_date[i], data_obj: obj_item}))
                            } catch (e) { }
                        }
                        
                        i++;
                        if(i >= list_date.length){
                            dispatch(isLoading(false));
                            clearInterval(interval24);
                        }
                        next_type = false;
                    })
                }
            }, 500);
        })
    }
}

export const convert_data_detail = (data) => {
    return (dispatch, getState) => {
        var obj_data = {
            date_time: data.date_time,
            symbol: data.data_obj.symbol, 
            symbolName: data.data_obj.symbolName, 
            last: data.data_obj.last,
            changeRate: 0,
            list_change_rate: calculate_percent_height(data.data_obj.list_change_rate, 0),
            volValue: data.data_obj.volValue,
            high: data.data_obj.high,
            low: data.data_obj.low,
            list_calculator: [],
        };
        dispatch(calculateChartQualified_forDetail(obj_data));
    }
}

export const calculateChartQualified_forDetail = (element) => {
    return (dispatch, getState) => {
        var max_height = 0;
        var count_elm = 0;
        var position_max = 0;
        var up_or_down = false;
        for(var i = 0; i < element.list_change_rate.length; i++){
            try {
                if(max_height < (element.list_change_rate[i].height_center < 0 ? (element.list_change_rate[i].height_center * -1) : element.list_change_rate[i].height_center)){
                    if(element.list_change_rate[i].height_center < 0){
                        up_or_down = false;
                    } else {
                        up_or_down = true;
                    }
                    max_height = (element.list_change_rate[i].height_center < 0 ? (element.list_change_rate[i].height_center * -1) : element.list_change_rate[i].height_center);
                    position_max = i;
                }
            } catch (error) { }
        }
        if(position_max < (element.list_change_rate.length/2)){
            try {
                for(var j = position_max; j < element.list_change_rate.length; j++){
                    if(((element.list_change_rate[j].height_center < 0 ? (element.list_change_rate[j].height_center * -1) : element.list_change_rate[j].height_center)/max_height) < 0.22 && element.list_change_rate[j].height_center != 0){
                        count_elm++;
                    }
                }

                if((count_elm/((element.list_change_rate.length + 1) - position_max)) > 0.75){
                    if(up_or_down){
                        element.list_calculator.push(1);
                    } else {
                        element.list_calculator.push(2);
                    }
                }
            } catch (error) { } 
        }

        dispatch(calculateConsecutive5ColummIncrease_forDetail(element));
    }
}

export const calculateConsecutive5ColummIncrease_forDetail = (element) => {
    return (dispatch, getState) => {
        var count_columm_increase = 1;
        var nan = false;
        for(var i = (element.list_change_rate.length - 1); i > (element.list_change_rate.length/2); i--){
            try {
                if(element.list_change_rate[i].height_center >= 0 && count_columm_increase < 5){
                    if(i < (element.list_change_rate.length - 1)){
                        if(element.list_change_rate[i+1].height_center >= 0){
                            count_columm_increase++;
                        } else {
                            count_columm_increase = 1;
                        }
                    }
                }

                if(count_columm_increase > 4){
                    let height_increase = (element.list_change_rate[i + 4].height_center + element.list_change_rate[i + 4].height_bottom)/element.list_change_rate[i + 4].max_height;
                    let height_current = ((element.list_change_rate[element.list_change_rate.length - 1].height_center < 0 ? (element.list_change_rate[element.list_change_rate.length - 1].height_center * -1) : element.list_change_rate[element.list_change_rate.length - 1].height_center) + element.list_change_rate[element.list_change_rate.length - 1].height_bottom)/element.list_change_rate[element.list_change_rate.length - 1].max_height;
                    if((height_increase - height_current) < 0.2){
                        element.list_calculator.push(3);
                        nan = true;
                    }
                    count_columm_increase = 1;
                    break;
                }
            } catch (error) { }
        }

        if(nan && element.list_calculator.length > 0){
            let list = element.list_calculator;
            list.forEach(elm => {
                if(elm == 1){
                    element.list_calculator.push(4);
                }
                if(elm == 2){
                    element.list_calculator.push(5);
                }
            });
        }
        var list_detail = getState().KC.list_detail_list_chart;
        list_detail.push(element);
        dispatch(list_detail_list_chart(list_detail));
    }
}

export const getQuikData_24h = () => {
    return (dispatch, getState) => {
        dispatch(getData_24h());
        setTimeout(() => {
            dispatch(readDataFromFirebase_24h());
        }, 300);
    }
}

export const getData_24h = () => {
    return async (dispatch, getState) => {
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
        let objData = (await response.json()).data.ticker.filter(el => el.symbol.indexOf('-BTC') > 0);
        dispatch(list_data(objData));
    }
}

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
                        dispatch(list_data_firebase(list));
                        setTimeout(() => {
                            dispatch(convert_list_data());
                        }, 200);
                    }
                }
            })
        } catch (e){
            
        }
    }  
}

export const getDataDetail_24h = (symbol) => {
    return (dispatch, getState) => {
        get_date_time_one_day().then(list_date => {
            var i = 0;
            var next_type = false;
            let interval24 = setInterval(() => {
                if(!next_type){
                    next_type = true;
                    let path = '/dataKC_new_coin/' + list_date[i];
                    firebaseApp.database().ref(path).once('value', function (snapshot) {
                        if(JSON.stringify(snapshot) != "null"){
                            try{
                                let obj_item = (JSON.parse(snapshot.val().data).filter(el => (el.symbol + "") === (symbol + "")))[0];
                                obj_item.list_change_rate = obj_item.list_change_rate.reverse();
                                dispatch(convert_data_detail({date_time: list_date[i], data_obj: obj_item}))
                            } catch (e) { }
                        }
                        
                        i++;
                        if(i >= list_date.length){
                            dispatch(isLoading(false));
                            clearInterval(interval24);
                        }
                        next_type = false;
                    })
                }
            }, 500);
        })
    }
}

export const calculaing_data_qualified = () => {
    return (dispatch, getState) => {

        let list_calculate_nan_24h = null;
        let list_calculaing = null;
        if(getState().KC.select_hour == 0){
            list_calculate_nan_24h = getState().KC.list_calculate_nan_24h;
            list_calculaing = getState().KC.list_calculate_nan_1h.filter(el => list_calculate_nan_24h.some(item => ("" + el.symbol) === ("" + item.symbol)));
        } else {
            list_calculate_nan_24h = getState().KC.list_calculate_nan_1h;
            list_calculaing = getState().KC.list_calculate_nan_24h.filter(el => list_calculate_nan_24h.some(item => ("" + el.symbol) === ("" + item.symbol)));
        }

        dispatch(list_calculaing_data_qualified(list_calculaing));
        dispatch(isLoading(false));
    }
}




