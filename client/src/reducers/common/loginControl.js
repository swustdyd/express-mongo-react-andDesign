let initState = {
    hasLogin: false,
    user: '',
    message: '',
    actionSuccess: false
};

export default (state = initState, action) => {
    switch (action.type){
        case 'LOGIN_SUCCESS':
            return Object.assign({}, state, {
                hasLogin: true,
                actionSuccess: true,
                user: action.payload.user,
                message: action.payload.message
            });
        case 'LOGIN_FAIL':
            return Object.assign({}, state, {
                actionSuccess: false,
                message: action.payload.message
            });
        case 'LOGOUT_SUCCESS':
            return Object.assign({}, state, {actionSuccess: true, hasLogin: false, message: action.payload.message});
        case 'LOGOUT_FAIL':
            return Object.assign({}, state, {actionSuccess: false, message: action.payload.message});
        case 'MODIFY_PWD_SUCCESS':
            return Object.assign({}, state, {actionSuccess: true, message: action.payload.message});
        case 'MODIFY_PWD_FAIL':
            return Object.assign({}, state, {actionSuccess: false, message: action.payload.message});
        case 'USER_REGISTER_SUCCESS':
            return Object.assign({}, state, {actionSuccess: true, message: action.payload.message});
        case 'USER_REGISTER_FAIL':
            return Object.assign({}, state, {actionSuccess: false, message: action.payload.message});
        default:
            return state;
    }
}