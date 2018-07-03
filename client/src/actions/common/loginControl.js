import API from '../../common/api'
import Cookies from 'js-cookie'

export const loginControlActionType = {
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
    ACTION_SUCCESS: 'ACTION_SUCCESS',
    ACTION_FAIL: 'ACTION_FAIL'
}

const loginControlAction = {
    loginSuccess: (user, message) => {
        return {
            type: loginControlActionType.LOGIN_SUCCESS,
            payload: {
                user: user,
                message: message
            }
        }
    },
    logoutSuccess: (message) => {
        return {
            type: loginControlActionType.LOGOUT_SUCCESS,
            payload: {
                message: message
            }
        }
    },
    actionSuccess: (message) => {
        return {
            type: loginControlActionType.ACTION_SUCCESS,
            payload:{
                message: message
            }
        }
    },
    actionFail: (message) => {
        return {
            type: loginControlActionType.ACTION_FAIL,
            payload:{
                message: message
            }
        }
    },    
    login: (name, password, sevenDay) => {
        return (dispatch, getState) => {
            ajax(API.signin, {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({user: {name: name, password: password}, sevenDay: sevenDay})
            }).then((res) => { 
                return res.json()
            }).then((data) => {
                if(data.success){
                    dispatch(loginControlAction.loginSuccess(data.result, data.message));
                }else {
                    dispatch(loginControlAction.actionFail(data.message))
                }
            });
        }
    },
    logout: () => {
        return (dispatch, getState) => {
            ajax(API.logout, {
                credentials: 'include'
            }).then((res) => {
                return res.json()
            }).then((data) => {
                if(data.success){
                    //dispatch(loginControlAction.logoutSuccess(data.message));
                    window.location.reload();
                }else {
                    dispatch(loginControlAction.actionFail(data.message))
                }
            });
        }
    },
    checkLogin: () => {
        return (dispatch, getState) => {
            ajax(API.checkLogin).then((res) => {
                return res.json()
            }).then((data) => {
                if(data.success){
                    dispatch(loginControlAction.loginSuccess(data.result));
                }
            });
        }
    },
    modifyPwd: (originPwd, newPwd) => {
        return (dispatch) => {
            ajax(API.updatePwd, {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({originPwd: originPwd, newPwd: newPwd})
            }).then((res) => { 
                return res.json()
            }).then((data) => {
                if(data.success){
                    dispatch(loginControlAction.actionSuccess(data.message));
                }else {
                    dispatch(loginControlAction.actionFail(data.message))
                }
            })
        }
    },
    userRegister: (name, pwd) => {
        return (dispatch) => {
            ajax(API.signup, {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({user: {name: name, password: pwd}})
            }).then((res) => {
                return res.json()
            }).then((data) => {
                if(data.success){
                    dispatch(loginControlAction.actionSuccess(data.message));
                }else {
                    dispatch(loginControlAction.actionFail(data.message))
                }
            })
        }
    }
};

export default loginControlAction;