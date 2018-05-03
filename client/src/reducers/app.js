/**
 * Created by Aaron on 2018/3/10.
 */
import { combineReducers } from 'redux'
import MovieReducer from './movie/movie'
import CommonReducer from './common/common'
import UserReducer from './user/user'

export default combineReducers({
    movie: MovieReducer,
    common: CommonReducer,
    user: UserReducer,
    style: () =>({
        headerHeight: 60,
        footerHeight: 50
    })
});