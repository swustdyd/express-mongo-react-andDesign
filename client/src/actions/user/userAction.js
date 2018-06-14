/**
 * Created by Aaron on 2018/3/12.
 */
import API from '../../common/api'
import Cookies from 'js-cookie'
import Common from '../../common/common'

export default {
    searchUsers: (condition, pageIndex, pageSize, cb) => {
        return (dispatch, getState) => {
            if((typeof condition) === 'function'){
                cb = condition;
                condition = {};
            }
            if((typeof pageIndex) === 'function'){
                cb = pageIndex;
                pageIndex = 0;
            }
            if((typeof pageSize) === 'function'){
                cb = pageSize;
                pageSize = 5;
            }
            fetch(`${API.getUsers}?pageIndex=${pageIndex || 0}&${Common.parseCondition(condition)}`)
                .then((res) => {
                    return res.json()
                }).then((data) => {
                    cb(undefined, data);
                }).catch((err) => {
                    cb(err)
                });
        }
    },
    deleteUser: (id, cb) => {
        return () => {
            fetch(`${API.deleteUser}?id=${id}`)            
                .then((res) => {
                    return res.json()
                }).then((data) => {
                    if(cb){                    
                        cb(undefined, data);
                    }
                }).catch((err) => {
                    cb(err)
                });
        }
    },
    editUser:(user, cb: (err: Error, data) => {}) => {
        return () => {
            fetch(API.editUser, {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({user})
            }).then((res) => {
                return res.json()
            }).then((data) => {
                if(cb){
                    cb(undefined, data)
                }
            }).catch((err) => {
                cb(err);
            });
        }
    }
}