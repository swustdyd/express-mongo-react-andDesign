/**
 * Created by Aaron on 2018/3/10.
 */
import API from '../../common/api'

export default {
    searchMovies: (condition, pageIndex, pageSize, cb) => (dispatch, getState) =>{
        if((typeof condition) === 'function'){
            cb = condition;
        }
        if((typeof pageIndex) === 'function'){
            cb = pageIndex;
            pageIndex = 0;
        }
        if((typeof pageSize) === 'function'){
            cb = pageSize;
            pageSize = 5;
        }
        fetch(`${API.getMovies}?pageIndex=${pageIndex || 0}&pageSize=${pageSize || 5}&condition=${JSON.stringify(condition || {})}`)
            .then(res => res.json())
            .then(data => {
                cb(undefined, data);
            })
            .catch(err => cb(err));
    },
    loadMovieList: (movies, pageIndex, pageSize, total) =>({
        type: 'LOAD_MOVIE_LIST',
        payload: {
            movies: movies,
            total: total,
            pageIndex: pageIndex,
            pageSize: pageSize
        }
    }),
    deleteMovie: (id, cb) => () =>{
        fetch(`${API.deleteMovie}?id=${id}`)
            .then(res => res.json())
            .then(data => {
                cb(undefined, data);
            })
            .catch(err => cb(err));
    }
}
