import { combineReducers } from 'redux'
import UserListReducer from './userList'

export default combineReducers({
    userList: UserListReducer
});