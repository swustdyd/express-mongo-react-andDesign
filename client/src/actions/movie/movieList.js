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
                conditionArray.push(`${key}=${condition[key]}`);
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
    loadMovieList: (movies, pageIndex, pageSize, total) => {
        return {
            type: 'LOAD_MOVIE_LIST',
            payload: {
                movies: movies,
                total: total,
                pageIndex: pageIndex,
                pageSize: pageSize
            }
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
