/**
 * Created by Aaron on 2018/3/12.
 */
import API from '../../common/api'
import Cookies from 'js-cookie'

export default {
    searchUsers: (condition, pageIndex, pageSize, cb) => {
        return (dispatch, getState) => {
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
            fetch(`${API.getUsers}?pageIndex=${pageIndex || 0}&condition=${JSON.stringify(condition || {})}`)
                .then((res) => {
                    return res.json()
                }).then((data) => {
                    cb(undefined, data);
                }).catch((err) => {
                    cb(err)
                });
        }
    },
    loadUsersList: (users, pageIndex, pageSize, total) => {
        return {
            type: 'LOAD_USER_LIST',
            payload: {
                users: users,
                total: total,
                pageIndex: pageIndex,
                pageSize: pageSize
            }
        }
    },
    deleteUser: (id, cb) => {
        return () => {
            fetch(`${API.deleteUser}?id=${id}`, {
                //同域名下，会带上cookie，否则后端根据sessionid获取不到对应的session
                credentials: 'include'
            }).then((res) => {
                return res.json()
            }).then((data) => {
                cb(undefined, data);
            }).catch((err) => {
                cb(err)
            });
        }
    }
}