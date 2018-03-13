/**
 * Created by Aaron on 2018/3/12.
 */
export default {
    searchMovies: (condition, pageIndex, cb) => (dispatch, getState) =>{
        fetch(`/movie/getUsers?pageIndex=${pageIndex || 0}&condition=${JSON.stringify(condition || {})}`)
            .then(res => res.json())
            .then(data => {
                cb(undefined, data);
            })
            .catch(err => cb(err));
    }
}