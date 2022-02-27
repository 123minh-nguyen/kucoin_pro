const model = {
    isLoading: false,
    select_page: 0,
    select_search: false,
    search_filter: "",
    select_sort: 4,             // 1: Pair, 2: Change, 3: Vol, 4: Qualified
    select_hour: 0,             // 0: 1h, 1: 24h
    listData: [],
    listData_firebase: [],
    listData_firebase_24h: [],
    listData_convert: [],
    listData_convert_24h: [],
    list_calculate_chart: [],
    list_calculate_nan: [],
    list_calculate_nan_1h: [],
    list_calculate_nan_24h: [],
    list_bookmark: [],
    list_detail_list_chart: [],
    list_calculaing_data_qualified: [],
};

const KCReducer = (state = model, action) => {
    switch (action.type) {
        case 'SET_IS_LOADING':
            state = { 
                ...state, 
                isLoading: action.isLoading
            }
            break;
        case 'SET_SELECT_PAGE':
            state = { 
                ...state, 
                select_page: action.select_page
            }
            break;
        case 'SET_SELECT_SEARCH':
            state = { 
                ...state, 
                select_search: action.select_search
            }
            break;
        case 'SET_FILTER_SEARCH':
            state = { 
                ...state, 
                search_filter: action.search_filter
            }
            break;
        case 'SET_SELECT_SORT':
            state = { 
                ...state, 
                select_sort: action.select_sort
            }
            break;
        case 'SET_SELECT_HOUR':
            state = { 
                ...state, 
                select_hour: action.select_hour
            }
            break;
        case 'SET_LIST_DATA':
            state = { 
                ...state, 
                listData: action.listData
            }
            break;
        case 'SET_LIST_DATA_FIREBASE':
            state = { 
                ...state, 
                listData_firebase: action.listData_firebase
            }
            break;
        case 'SET_LIST_DATA_FIREBASE_24H':
            state = { 
                ...state, 
                listData_firebase_24h: action.listData_firebase_24h
            }
            break;
        case 'SET_LIST_DATA_CONVERT':
            state = { 
                ...state, 
                listData_convert: action.listData_convert
            }
            break;
        case 'SET_LIST_DATA_CONVERT_24H':
            state = { 
                ...state, 
                listData_convert_24h: action.listData_convert_24h
            }
            break;
        case 'SET_LIST_CALCULATE_CHART':
            state = { 
                ...state, 
                list_calculate_chart: action.list_calculate_chart
            }
            break;
        case 'SET_LIST_CALCULATE_NAN':
            state = { 
                ...state, 
                list_calculate_nan: action.list_calculate_nan
            }
            break;
        case 'SET_LIST_CALCULATE_NAN_1H':
            state = { 
                ...state, 
                list_calculate_nan_1h: action.list_calculate_nan_1h
            }
            break;
        case 'SET_LIST_CALCULATE_NAN_24H':
            state = { 
                ...state, 
                list_calculate_nan_24h: action.list_calculate_nan_24h
            }
            break;
        case 'SET_LIST_BOOKMARK':
            state = { 
                ...state, 
                list_bookmark: action.list_bookmark
            }
            break;
        case 'SET_LIST_DETAIL_LIST_CHART':
            state = { 
                ...state, 
                list_detail_list_chart: action.list_detail_list_chart
            }
            break;
        case 'SET_LIST_CALCULATING_DATA_QUALIFIED':
            state = { 
                ...state, 
                list_calculaing_data_qualified: action.list_calculaing_data_qualified
            }
            break;
    }
    return state;
};

export default KCReducer;