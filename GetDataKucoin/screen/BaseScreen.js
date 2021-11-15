import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getIdByDateTime = () => {
    return new Promise(async (resolve, reject) => {
        try{
            var date = new Date();
            let year = "" + date.getFullYear();
            let month = (date.getMonth() + 1) > 9 ? ("" + (date.getMonth() + 1)) : ("0" + (date.getMonth() + 1));
            let day = date.getDate() > 9 ? ("" + date.getDate()) : ("0" + date.getDate());
            let hours = date.getHours() > 9 ? ("" + date.getHours()) : ("0" + date.getHours());
            // let minutes = date.getMinutes() > 9 ? ("" + date.getMinutes()) : ("0" + date.getMinutes());
            resolve(year + '-' + month + '-' + day + hours + ':00');
        } catch (e){
            reject(e);
        }
    }) 
}

export const getDateTimeLastOneHour = () => {
    return new Promise(async (resolve, reject) => {
        try{
            var date = new Date();
            var year_1h = "";
            var month_1h = "";
            var day_1h = "";
            var hours = "";
            
            //// hour
            if((date.getHours() - 1) < 0){
                hours = "23";
                if((date.getDate() - 1) < 1){
                    if((date.getMonth() + 1) == 1){
                        year_1h = "" + (date.getFullYear() - 1);
                        month_1h = date.getMonth() > 9 ? (date.getMonth() + "") : ("0" + date.getMonth());
                        let day = get_num_day_of_month((date.getFullYear() - 1), date.getMonth());
                        day_1h = day > 9 ? (day + "") : ("0" + day);
                    } else {
                        year_1h = "" + (date.getFullYear());
                        month_1h = (date.getMonth() + 1) > 9 ? ((date.getMonth() + 1) + "") : ("0" + (date.getMonth() + 1));
                        let day = get_num_day_of_month(date.getFullYear(), (date.getMonth() + 1))
                        day_1h = day > 9 ? (day + "") : ("0" + day);
                    }
                } else {
                    year_1h = "" + (date.getFullYear());
                    month_1h = (date.getMonth() + 1) > 9 ? ((date.getMonth() + 1) + "") : ("0" + (date.getMonth() + 1));
                    day_1h = (date.getDate() - 1) > 9 ? ("" + (date.getDate() -1)) : ("0" + (date.getDate() - 1));
                }
            } else {
                year_1h = "" + (date.getFullYear());
                month_1h = (date.getMonth() + 1) > 9 ? ((date.getMonth() + 1) + "") : ("0" + (date.getMonth() + 1));
                day_1h = date.getDate() > 9 ? ("" + date.getDate()) : ("0" + date.getDate());
                hours = (date.getHours() - 1) > 9 ? ("" + (date.getHours() - 1)) : ("0" + (date.getHours() - 1));
            }

            resolve((year_1h + '-' + month_1h + '-' + day_1h + hours + ':00'));
        } catch (e){
            reject(e);
        }
    }) 
}

export const getDateTimeToRemoveDatebase = () => {
    return new Promise(async (resolve, reject) => {
        try{
            var date = new Date();
            let year = "" + date.getFullYear();
            let month = (date.getMonth()) > 9 ? ("" + (date.getMonth())) : ("0" + (date.getMonth()));
            let day = date.getDate() > 9 ? ("" + date.getDate()) : ("0" + date.getDate());
            resolve(year + '-' + month + '-' + day);
        } catch (e){
            reject(e);
        }
    })
}

export const getDateTime = () => {
    try{
        var date = new Date();
        let year = "" + date.getFullYear();
        let month = (date.getMonth() + 1) > 9 ? ("" + (date.getMonth() + 1)) : ("0" + (date.getMonth() + 1));
        let day = date.getDate() > 9 ? ("" + date.getDate()) : ("0" + date.getDate());
        let hours = date.getHours() > 9 ? ("" + date.getHours()) : ("0" + date.getHours());
        return (year + '-' + month + '-' + day + " " + hours + ":00");
    } catch (e){}
}

export function setAsyncStorage (key, value){
    return new Promise(async (resolve, reject) => {
        try {
            AsyncStorage.setItem(
                key,
                value
            );
            resolve(true);
        } catch (error) {
            reject(error);
        }
    }) 
}

export function getAsyncStorage (key){
    return new Promise(async (resolve, reject) => {
        try {
            AsyncStorage.getItem(key).then((value) => {
                resolve(value);
            }).catch(e => {
                reject(e);
            });
        } catch (error) {
            reject(error);
        }
    }) 
}

export function get_num_day_of_month(year, month){
    var num_day = 0;
    if (month >= 1 && month <= 12){
                switch (month)
                {
                    case 1: num_day = 31; break;
                    case 3: num_day = 31; break;
                    case 5: num_day = 31; break;
                    case 7: num_day = 31; break;
                    case 8: num_day = 31; break;
                    case 10: num_day = 31; break;
                    case 12: num_day = 31; break;
                    case 4: num_day = 30; break;
                    case 6: num_day = 30; break;
                    case 9: num_day = 30; break;
                    case 11: num_day = 30; break;
                    case 2:
                        if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0))
                            num_day = 29;
                        else
                            num_day = 28;
                        break;
                }
 
        return num_day;
    } else {
        return 0;
    }  
}

export const get_date_time_by_hour = (num_item_list, num_hour) => {
    return new Promise(async (resolve, reject) => {
        try{
            var date = new Date();
            var list_hour = [];

            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate()
            var hour = date.getHours();
            var num_hour_tam = num_hour;

            if(num_hour_tam > 24){
                for(var i = 0; i < (num_hour/24); i++){
                    if(num_hour_tam > 24){
                        num_hour_tam = num_hour_tam - 24;
                        day--;
                        if(day < 1){
                            month--;
                            if(month < 1){
                                year--;
                                month = 12;
                            }
                            day = get_num_day_of_month(year, month);
                        }
                    }
                }
            }
            
            for(let i = 1; i <= num_item_list; i++){
                hour = hour - num_hour_tam;
                if(hour < 0){
                    day = day - 1;
                    if(day < 1){
                        month = month - 1;
                        if(month < 1){
                            year = year - 1;
                            month = 12;
                            hour = 24 + hour;
                            day = get_num_day_of_month(year, month);
                            list_hour.push(get_string_date_time(year, month, day, hour));
                        } else {
                            hour = 24 + hour;
                            day = get_num_day_of_month(year, month);
                            list_hour.push(get_string_date_time(year, month, day, hour));
                        }
                    } else {
                        hour = 24 + hour;
                        list_hour.push(get_string_date_time(year, month, day, hour));
                    }
                } else {
                    list_hour.push(get_string_date_time(year, month, day, hour));
                }
            }
            // console.log("get_date_time_by_hour: " + JSON.stringify(list_hour));
            resolve(list_hour);
        } catch (e){
            reject(e);
        }
    })
}

function get_string_date_time(year, month, day, hour){
    return year + "-" + round_num_date(month) + "-" + round_num_date(day) + "/" + round_num_date(hour) + ":00";
}

function round_num_date(val){
    if(val < 10){
        return "0" + val;
    } else {
        return "" + val;
    }
}