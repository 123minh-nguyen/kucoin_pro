import { combineReducers } from 'redux';

import KCReducer from './KCReducer';


export default combineReducers({
    KC: KCReducer,
});