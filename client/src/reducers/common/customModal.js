/**
 * Created by Aaron on 2018/3/10.
 */
import { modalActionType } from '../../actions/common/customModal';

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
        case modalActionType.SHOW_MODAL:
            return Object.assign({}, state, action.payload, {visible: true});
        case modalActionType.HIDE_MODAL:
            return initState;
        default:
            return state;
    }
}