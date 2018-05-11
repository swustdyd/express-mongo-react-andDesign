/**
 * Created by Aaron on 2018/3/10.
 */

const initState = {
    title: '',
    visible: false,
    footer: null,
    maskClosable: true,
    destroyOnClose: true,
    width: 600,
    style: {},
    modalContent: ''
};

export default (state = initState, action) => {
    switch (action.type){
        case 'SHOW_MODAL':
            return Object.assign({}, state, action.payload, {visible: true});
        case 'HIDE_MODAL':
            return Object.assign({}, initState);
        default:
            return state;
    }
}