/**
 * Created by Aaron on 2018/3/10.
 */
export default {
    searchMovies: (condition, pageIndex, cb) => (dispatch, getState) =>{
        fetch(`/movie/getMovies?pageIndex=${pageIndex || 0}&condition=${JSON.stringify(condition || {})}`)
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
        fetch(`/movie/delete?id=${id}`)
            .then(res => res.json())
            .then(data => {
                cb(undefined, data);
            })
            .catch(err => cb(err));
    }
}
