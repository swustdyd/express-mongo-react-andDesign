/**
 * Created by Aaron on 2018/3/10.
 */
const initState = {
};
export default (state = initState, action) => {
    switch (action.type){
        case 'LOAD_MOVIE_LIST':
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}
