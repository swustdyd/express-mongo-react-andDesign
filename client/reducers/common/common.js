/**
 * Created by Aaron on 2018/3/10.
 */
import { combineReducers } from 'redux'
import ModalReducer from './customModal'

export default combineReducers({
    modal: ModalReducer,
});