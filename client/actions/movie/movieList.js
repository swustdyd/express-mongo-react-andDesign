/**
 * Created by Aaron on 2018/3/10.
 */
export default {
    searchMovies: (condition, pageIndex, cb) => (dispatch, getState) =>{
        fetch(`/movie/getMovies?pageIndex=${pageIndex || 0}&condition=${JSON.stringify(condition || {})}`)
            .then(res => res.json())
            .then(data => {
                /*if(data.result && data.result.length > 0){
                    data.result.forEach(function (item) {
                        item.key = item._id;
                    });
                }
                _this.setState({
                    movies: data.result,
                    total: data.total,
                    pageIndex: data.pageIndex,
                    pageSize: data.pageSize
                })*/
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
                /*if(data.success){
                    message.success(data.message);
                    _this.searchAndLoadMovies();
                }else{
                    message.error(data.message);
                }*/
                cb(undefined, data);
            })
            .catch(err => cb(err));
    }
}
