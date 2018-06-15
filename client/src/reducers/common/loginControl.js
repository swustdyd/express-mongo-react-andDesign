import { loginControlActionType } from '../../actions/common/loginControl';

const initState = {
    hasLogin: false,
    user: '',
    message: '',
    actionSuccess: false
};

export default (state = initState, action) => {
    switch (action.type){
        case loginControlActionType.LOGIN_SUCCESS:
            return Object.assign({}, state, {
                hasLogin: true,
                actionSuccess: true,
                user: action.payload.user,
                message: action.payload.message
            });
        case loginControlActionType.LOGOUT_SUCCESS:
            return Object.assign({}, state, {actionSuccess: true, hasLogin: false, message: action.payload.message});
        case loginControlActionType.ACTION_SUCCESS:
            return Object.assign({}, state, {actionSuccess: true, message: action.payload.message});
        case loginControlActionType.ACTION_FAIL:
            return Object.assign({}, state, {actionSuccess: false, message: action.payload.message});
        default:
            return state;
    }
}