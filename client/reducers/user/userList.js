let initState ={
    total: 0,
    pageIndex: 0,
    pageSize: 0,
    users: [],
};

export default (state = initState, action) => {
    switch (action.type){
        case 'LOAD_USER_LIST':
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}