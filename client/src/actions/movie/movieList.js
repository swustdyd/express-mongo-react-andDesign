/**
 * Created by Aaron on 2018/3/10.
 */
import API from '../../common/api'

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
            const conditionArray = [];
            for(const key in condition){
                if(condition[key]){                    
                    conditionArray.push(`${key}=${condition[key]}`);
                }
            }
            fetch(`${API.getMovies}?pageIndex=${pageIndex || 0}&pageSize=${pageSize || 5}&${conditionArray.join('&')}`)
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
    }
}
