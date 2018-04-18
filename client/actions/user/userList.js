/**
 * Created by Aaron on 2018/3/12.
 */
export default {
    searchUsers: (condition, pageIndex, pageSize, cb) => (dispatch, getState) =>{
        if((typeof condition) === 'function'){
            cb = condition;
        }
        if((typeof pageIndex) === 'function'){
            cb = pageIndex;
            pageIndex = 0;
        }
        if((typeof pageSize) === 'function'){
            cb = pageSize;
            pageSize = 5;
        }
        fetch(`/user/getUsers?pageIndex=${pageIndex || 0}&condition=${JSON.stringify(condition || {})}`, {
            //同域名下，会带上cookie，否则后端根据sessionid获取不到对应的session
            credentials: 'include'
        }).then(res => res.json())
            .then(data => {
                cb(undefined, data);
            })
            .catch(err => cb(err));
    },
    loadUsersList: (users, pageIndex, pageSize, total) =>({
        type: 'LOAD_USER_LIST',
        payload: {
            users: users,
            total: total,
            pageIndex: pageIndex,
            pageSize: pageSize
        }
    }),
    deleteUser: (id, cb) => () =>{
        fetch(`/user/delete?id=${id}`, {
            //同域名下，会带上cookie，否则后端根据sessionid获取不到对应的session
            credentials: 'include'
        }).then(res => res.json())
            .then(data => {
                cb(undefined, data);
            })
            .catch(err => cb(err));
    }
}