/**
 * Created by Aaron on 2018/3/10.
 */
import { combineReducers } from 'redux'
import MovieListReducer from './movieList'

export default combineReducers({
    movieList: MovieListReducer
});