import {firebaseApp} from '../util/FirebaseDatabaseApp'
import {get_date_time_one_day, getDateTimeOneLastHour} from '../util/BaseUtil'

export const getData_firebase_for_calculate = () => {
    return (dispatch, getState) => {
        var date = new Date();
        let year = "" + date.getFullYear();
        let month = (date.getMonth() + 1) > 9 ? ("" + (date.getMonth() + 1)) : ("0" + (date.getMonth() + 1));
        let day = date.getDate() > 9 ? ("" + date.getDate()) : ("0" + date.getDate());
        let path = '/dataKC_new_coin/' + year + '-' + month + '-' + day + '00:00';
        firebaseApp.database().ref(path).once('value', function (snapshot) {
            if(JSON.stringify(snapshot) == "null"){
                
            } else {
                if(snapshot.val().data.length > 0){
                    var list = JSON.parse(snapshot.val().data);
                    list.forEach(element => {
                        element.list_change_rate = element.list_change_rate.reverse();
                    })
                    dispatch(count_qualified_list_data(list));
                }
            }
        })
    }
}

export const count_qualified_list_data = (list_data_firebase) => {
    return (dispatch, getState) => {
        var count_qualified = 0;
        var count_columm_increase = 0;
        var count_not_columm_increase = 0;
        list_data_firebase.forEach(element => {
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

                if(count_columm_increase < 6){
                    count_columm_increase = 0;
                    count_not_columm_increase = 0;
                    count_val_qualified++;
                }
            }
            element.count_qualified = count_qualified;
            count_columm_increase = 0;
            count_not_columm_increase = 0;
            count_val_qualified = 0;
        })
    }
}

