/**
 * Created by Aaron on 2018/3/10.
 */
import API from '../../common/api'

export default {
    searchMovies: (condition, pageIndex, pageSize, callback) => {
        return (dispatch, getState) => {
            if((typeof condition) === 'function'){
                callback = condition;
            }
            if((typeof pageIndex) === 'function'){
                callback = pageIndex;
                pageIndex = 0;
            }
            if((typeof pageSize) === 'function'){
                callback = pageSize;
                pageSize = 5;
            }
            fetch(`${API.getMovies}?pageIndex=${pageIndex || 0}&pageSize=${pageSize || 5}&condition=${JSON.stringify(condition || {})}`)
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
