/**
 * Created by Aaron on 2018/3/10.
 */
import { fromJS } from 'immutable'

let initState = {
    total: 0,
    pageIndex: 0,
    pageSize: 0,
    movies: [],
    modalTitle: '',
    modalVisible: false,
    modalContent: ''
};
export default (state = initState, action) => {
    switch (action.type){
        default:
            return state;
    }
}
