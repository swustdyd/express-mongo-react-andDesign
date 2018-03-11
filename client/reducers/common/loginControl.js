let initState = {
    hasLogin: false,
    userName: '',
    message: '',
    loginActionSuccess: false
};

export default (state = initState, action) => {
    switch (action.type){
        case 'LOGIN_SUCCESS':
            return Object.assign({}, state, { hasLogin: true, loginActionSuccess: true, userName: action.payload.name });
        case 'LOGIN_FAIL':
            return Object.assign({}, state, {loginActionSuccess: false, message: action.payload.message});
        case 'LOGOUT_SUCCESS':
            return Object.assign({}, state, { hasLogin: false});
        default:
            return state;
    }
}