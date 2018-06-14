/**
 * Created by Aaron on 2018/3/10.
 */
import API from '../../common/api'
import Common from '../../common/common'

export default {
    searchMovies: (condition, pageIndex, pageSize, callback) => {
        return (dispatch, getState) => {
            if((typeof condition) === 'function'){
                callback = condition;
                condition = {};
            }
            if((typeof pageIndex) === 'function'){
                callback = pageIndex;
                pageIndex = 0;
            }
            if((typeof pageSize) === 'function'){
                callback = pageSize;
                pageSize = 5;
            }
            fetch(`${API.getMovies}?pageIndex=${pageIndex || 0}&pageSize=${pageSize || 5}&${Common.parseCondition(condition)}`)
                .then((res) => {
                    return res.json()
                }).then((data) => {
                    callback(undefined, data);
                }).catch((err) => {
                    callback(err)
                });
        }
    },
    deleteMovie: (id, cb) => {
        return () => {
            fetch(`${API.deleteMovie}?id=${id}`)
                .then((res) => {
                    return res.json()
                }).then((data) => {
                    cb(undefined, data);
                }).catch((err) => {
                    cb(err)
                });
        }
    },
    getMovieByGroup: (group = '', whereArray = [], cb) => {
        if(typeof whereArray === 'function'){
            cb = whereArray;
            whereArray = [];
        }
        return () => {
            fetch(`${API.getMoviesByGroup}?group=${group}&whereArray=${JSON.stringify(whereArray)}`)
                .then((res) => {
                    return res.json()
                }).then((data) => {
                    if(cb){
                        cb(undefined, data)
                    }
                }).catch((err) => {
                    if(cb){
                        cb(err);
                    }
                });
        }        
    }
}
