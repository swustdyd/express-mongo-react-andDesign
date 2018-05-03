/**
 * Created by Aaron on 2018/3/10.
 */
import { combineReducers } from 'redux'
import ModalReducer from './customModal'
import LoginReducer from './loginControl'

export default combineReducers({
    modal: ModalReducer,
    login: LoginReducer
});