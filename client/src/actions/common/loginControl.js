import API from '../../common/api'
import Cookies from 'js-cookie'

const loginControlAction = {
    login: (name, password, sevenDay) => {
        return (dispatch, getState) => {
            fetch(API.signin, {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({user: {name: name, password: password}, sevenDay: sevenDay})
            }).then((res) => { 
                return res.json()
            }).then((data) => {
                if(data.success){
                    dispatch(loginControlAction.loginSuccess({name}, data.message));
                    Cookies.set('token', data.token);
                }else {
                    //console.log(data);
                    dispatch(loginControlAction.loginFail(data.message))
                }
            });
        }
    },
    logout: () => {
        return (dispatch, getState) => {
            fetch(API.logout, {
                credentials: 'include'
            }).then((res) => {
                return res.json()
            }).then((data) => {
                if(data.success){
                    //dispatch(loginControlAction.logoutSuccess(data.message));
                    window.location.reload();
                }else {
                    dispatch(loginControlAction.logoutFail(data.message))
                }
            });
        }
    },
    checkLogin: () => {
        return (dispatch, getState) => {
            fetch(API.checkLogin)
                .then((res) => {
                    return res.json()
                }).then((data) => {
                    if(data.success){
                        dispatch(loginControlAction.loginSuccess(data.result));
                    }
                });
        }
    },
    loginSuccess: (user, message) => {
        return {
            type: 'LOGIN_SUCCESS',
            payload: {
                user: user,
                message: message
            }
        }
    },
    loginFail: (message) => {
        return {
            type: 'LOGIN_FAIL',
            payload: {
                message: message
            }
        }
    },
    logoutSuccess: (message) => {
        return {
            type: 'LOGOUT_SUCCESS',
            payload: {
                message: message
            }
        }
    },
    logoutFail: (message) => {
        return {
            type: 'LOGOUT_FAIL',
            payload: {
                message: message
            }
        }
    },
    modifyPwd: (originPwd, newPwd) => {
        return (dispatch) => {
            fetch(API.updatePwd, {
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
                    dispatch(loginControlAction.modifyPwdSuccess(data.message));
                }else {
                    dispatch(loginControlAction.modifyPwdFail(data.message))
                }
            })
        }
    },
    modifyPwdSuccess: (message) => {
        return {
            type: 'MODIFY_PWD_SUCCESS',
            payload:{
                message: message
            }
        }
    },
    modifyPwdFail: (message) => {
        return {
            type: 'MODIFY_PWD_FAIL',
            payload:{
                message: message
            }
        }
    },
    userRegister: (name, pwd) => {
        return (dispatch) => {
            fetch(API.signup, {
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
                    dispatch(loginControlAction.userRegisterSuccess(data.message));
                }else {
                    dispatch(loginControlAction.userRegisterFail(data.message))
                }
            })
        }
    },
    userRegisterSuccess: (message) => {
        return {
            type: 'USER_REGISTER_SUCCESS',
            payload:{
                message: message
            }
        }
    },
    userRegisterFail: (message) => {
        return {
            type: 'USER_REGISTER_FAIL',
            payload:{
                message: message
            }
        }
    }
};

export default loginControlAction;