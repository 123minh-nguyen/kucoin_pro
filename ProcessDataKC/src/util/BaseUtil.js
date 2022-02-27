import AsyncStorage from '@react-native-async-storage/async-storage';
export const use_name = "quang";
export const use_name_2 = "Quang";
export const sympol_use = "@";

export const roundNumber = (num, scale) => {
    if(!("" + num).includes("e")) {
        return +(Math.round(num + "e+" + scale)  + "e-" + scale);
    } else {
        let arr = ("" + num).split("e");
        var sig = ""
        if(+arr[1] + scale > 0) {
            sig = "+";
        }
        return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
    }
}

export const getDateTimeOneLastHour = (val) => {
    return new Promise(async (resolve, reject) => {
        try{
            var date = new Date();
            let year = "" + date.getFullYear();
            let month = (date.getMonth() + 1) > 9 ? ("" + (date.getMonth() + 1)) : ("0" + (date.getMonth() + 1));
            let day = date.getDate() > 9 ? ("" + date.getDate()) : ("0" + date.getDate());
            let hours = (date.getHours() - val) > 9 ? ("" + (date.getHours() - val)) : (date.getHours() == 0 ? "23" : ("0" + (date.getHours() - val)));
            // let minutes = date.getMinutes() > 9 ? ("" + date.getMinutes()) : ("0" + date.getMinutes());
            resolve(year + '-' + month + '-' + day + hours + ':00');
        } catch (e){
            reject(e);
        }
    }) 
}

export const getDateTime = () => {
    return new Promise(async (resolve, reject) => {
        try{
            var date = new Date();
            let year = "" + date.getFullYear();
            let month = (date.getMonth() + 1) > 9 ? ("" + (date.getMonth() + 1)) : ("0" + (date.getMonth() + 1));
            let day = date.getDate() > 9 ? ("" + date.getDate()) : ("0" + date.getDate());
            let hours = date.getHours() > 9 ? ("" + date.getHours()) : ("0" + date.getHours());
            resolve(day + '/' + month + '/' + year + " " + hours + ':00');
        } catch (e){
            reject(e);
        }
    }) 
}

export function calculate_percent_height(list_data, change_new){
    try{
        let max_min_hieght = getCalculatorMax(list_data, change_new);
        var list_percent = [];
        var height_top = 0;
        var height_center = 0;
        var height_bottom = 0;
        for(var i = 0; i < list_data.length + 1; i++){
            if(i != list_data.length){
                if(i < 1){
                    height_center = getHeight_center(list_data[i]);
                    height_bottom = getHeight_bottom(max_min_hieght.max_height, max_min_hieght.max, max_min_hieght.min, list_data[i], null, null);
                    height_top = max_min_hieght.max_height - ((height_center < 0 ? height_center * -1 : height_center) + height_bottom);
                } else {
                    height_center = getHeight_center(list_data[i]);
                    height_bottom = getHeight_bottom(max_min_hieght.max_height, max_min_hieght.max, max_min_hieght.min, list_data[i], list_percent[i - 1].height_bottom, list_percent[i - 1].height_center);
                    height_top = max_min_hieght.max_height - ((height_center < 0 ? height_center * -1 : height_center) + height_bottom);
                }
                list_percent.push({price_current: list_data[i] < 0 ? -1 : 1, max_height: max_min_hieght.max_height, height_top: height_top, height_center: height_center, height_bottom: height_bottom})
            } else {
                height_center = getHeight_center(change_new);
                height_bottom = getHeight_bottom(max_min_hieght.max_height, max_min_hieght.max, max_min_hieght.min, change_new, list_percent[i - 1].height_bottom, list_percent[i - 1].height_center);
                height_top = max_min_hieght.max_height - ((height_center < 0 ? height_center * -1 : height_center) + height_bottom);
                list_percent.push({price_current: change_new < 0 ? -1 : 1, max_height: max_min_hieght.max_height, height_top: height_top, height_center: height_center, height_bottom: height_bottom})
            }
        }
        return list_percent;
    } catch (e){
        return [];
    } 
}

function getHeight_bottom(max_height, max, min, current_center, last_bottom, last_center){
    var bottom = 0;

    if(min < 0){
        min = min * -1;
    }

    if(last_center == null && last_bottom == null){ // calculate height of firt value 
        if(current_center < 0){
            if(current_center * 100 == min){
                bottom =  0.01;
            } else {
                bottom =  min + (current_center * 100);
            }
        } else {
            if(current_center * 100 == max){
                bottom =  max_height - (current_center * 100);
            } else {
                bottom =  min;
            }
        }
    } else { // calculate height of next value 
        if(last_center > 0){
            if(current_center >= 0){
                bottom =  last_bottom + last_center;
            } else {
                bottom =  (last_bottom + last_center) - ((current_center * -1) * 100);
            }
        } else {
            if(current_center >= 0){
                bottom =  last_bottom;
            } else {
                bottom =  last_bottom - ((current_center * -1) * 100);
            }
        }
    }

    return bottom < 0 ? bottom * -1 : bottom;
}

function getHeight_center(height_center){
    if(height_center == null || height_center == undefined){
        height_center = 0;
    }
    return height_center * 100;
}

function getCalculatorMax(val, change_new){
    var max = 0;
    var min = 0;
    var count = 0;

    for(var i = 0; i < (val.length + 1); i++){
        if(i != val.length){
            count = count + (val[i] * 100);

            if(max < count) {
                max = count;
            }

            if(min > count){
                min = count;
            }
        } else {
            count = count + (change_new * 100);

            if(max < count) {
                max = count;
            }

            if(min > count){
                min = count;
            }
        }
    }

    let max_height = (max < 0 ? max * -1 : max) + (min < 0 ? min * -1 : min);

    if(max_height == 0 && max == 0 && min == 0){
        max_height = 1;
        max = 1;
    }

    return {max_height: max_height, max: max, min: min}
}

export function setAsyncStorage (key, value){
    try {
        AsyncStorage.setItem(
            key,
            value
        );
        return true;
    } catch (error) {
        return false;
    }
}

export function getAsyncStorage(key){
    try {
        return new Promise(async (resolve, reject) => {
            try{
                AsyncStorage.getItem(key).then((value) => {
                    if(value === null){
                        resolve(null);
                    } else {
                        resolve(JSON.parse(value));
                    }
                }).catch(e => {
                    resolve(null);
                });
            } catch (e){
                reject(e);
            }
        }) 
    } catch (error) {
        return null;
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
            let hour = date.getHours();
            list_hour.push(get_string_date_time(year, month, day, hour));
            
            for(let i = 1; i < num_item_list; i++){
                hour = hour - num_hour;
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

function get_num_day_of_month(year, month){
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

export function checkPass(val){
    return new Promise(async (resolve, reject) => {
        let date = new Date();
        let hours = round_num_date(date.getHours());
        let minutes = round_num_date(date.getMinutes());

        let last = use_name + sympol_use + hours + minutes;
        let last_2 = use_name_2 + sympol_use + hours + minutes;
        if(last === val || last_2 === val){
            resolve(true);
        } else {
            resolve(false);
        }
    })
}

export function getIdByDateTime(){
    let date = new Date();
    return ("" + date.getFullYear() + round_num_date(date.getMonth() + 1) + round_num_date(date.getDate()) + round_num_date(date.getHours()) + round_num_date(date.getMinutes()) + round_num_date(date.getSeconds()))
}

export const get_date_time_one_day = () => {
    return new Promise(async (resolve, reject) => {
        try{
            var date = new Date();
            var list_hour = [];

            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate()
            let hour = 0;
            list_hour.push(get_string_date_time_one_day(year, month, day, hour));
            
            for(let i = 1; i < 30; i++){
                hour = hour - 24;
                if(hour < 0){
                    day = day - 1;
                    if(day < 1){
                        month = month - 1;
                        if(month < 1){
                            year = year - 1;
                            month = 12;
                            hour = 24 + hour;
                            day = get_num_day_of_month(year, month);
                            list_hour.push(get_string_date_time_one_day(year, month, day, hour));
                        } else {
                            hour = 24 + hour;
                            day = get_num_day_of_month(year, month);
                            list_hour.push(get_string_date_time_one_day(year, month, day, hour));
                        }
                    } else {
                        hour = 24 + hour;
                        list_hour.push(get_string_date_time_one_day(year, month, day, hour));
                    }
                } else {
                    list_hour.push(get_string_date_time_one_day(year, month, day, hour));
                }
            }
            resolve(list_hour);
        } catch (e){
            reject(e);
        }
    })
}

function get_string_date_time_one_day(year, month, day, hour){
    return year + "-" + round_num_date(month) + "-" + round_num_date(day) + "" + round_num_date(hour) + ":00";
}