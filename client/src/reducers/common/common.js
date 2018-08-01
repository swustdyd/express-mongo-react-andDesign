/**
 * Created by Aaron on 2018/3/10.
 */
import { combineReducers } from 'redux'
import {settingActionType} from '../../actions/common/settingAction'
import ModalReducer from './customModal'
import LoginReducer from './loginControl'

const settingState = {
    headerHeight: 0,
    footerHeight: 0
}

const setting = (state = settingState, action) => {
    switch(action.type){
        case settingActionType.CHANGE_HEADER_HEIGHT:
            return Object.assign({}, state, {headerHeight: action.payload.headerHeight});
        case settingActionType.CHANGE_FOOTER_HEIGHT:
            return Object.assign({}, state, {footerHeight: action.payload.footerHeight})
        default:
            return state;
    }
}

export default combineReducers({
    modal: ModalReducer,
    login: LoginReducer,
    setting
});