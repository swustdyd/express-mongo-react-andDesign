import Common from '../../common/common'

const loginControlAction = {
    login: (name, password, sevenDay) =>(dispatch, getState) => {
        fetch('/user/signin', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            //同域名下，会带上cookie，否则后端根据sessionid获取不到对应的session
            credentials: 'include',
            body: JSON.stringify({user: {name: name, password: password}, sevenDay: sevenDay})
        }).then(res => res.json())
            .then((data) => {
                if(data.success){
                    //dispatch(loginControlAction.loginSuccess(name, data.message))
                    window.location.reload();
                }else {
                    //console.log(data);
                    dispatch(loginControlAction.loginFail(data.message))
                }
            });
    },
    logout: () => (dispatch, getState) =>{
        fetch('/user/logout', {credentials: 'include'})
            .then(res => res.json())
            .then((data) => {
                if(data.success){
                    //dispatch(loginControlAction.logoutSuccess(data.message));
                    window.location.reload();
                }else {
                    dispatch(loginControlAction.logoutFail(data.message))
                }
            });
    },
    checkLogin: () => (dispatch, getState) =>{
        fetch('/user/checkLogin', {credentials: 'include'})
            .then(res => res.json())
            .then((data) => {
                if(data.success){
                    dispatch(loginControlAction.loginSuccess(data.result));
                }
            });
    },
    loginSuccess: (user, message) =>({
        type: 'LOGIN_SUCCESS',
        payload: {
            user: user,
            message: message
        }
    }),
    loginFail: (message) =>({
        type: 'LOGIN_FAIL',
        payload: {
            message: message
        }
    }),
    logoutSuccess: (message) =>({
        type: 'LOGOUT_SUCCESS',
        payload: {
            message: message
        }
    }),
    logoutFail: (message) =>({
        type: 'LOGOUT_FAIL',
        payload: {
            message: message
        }
    }),
    modifyPwd: (originPwd, newPwd) => (dispatch) => {
        fetch('/user/updatePwd', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({originPwd: originPwd, newPwd: newPwd})
        }).then(res => res.json())
            .then(data => {
                if(data.success){
                    dispatch(loginControlAction.modifyPwdSuccess(data.message));
                }else {
                    dispatch(loginControlAction.modifyPwdFail(data.message))
                }
            })
    },
    modifyPwdSuccess: (message) => ({
        type: 'MODIFY_PWD_SUCCESS',
        payload:{
            message: message
        }
    }),
    modifyPwdFail: (message) => ({
        type: 'MODIFY_PWD_FAIL',
        payload:{
            message: message
        }
    }),
    userRegister: (name, pwd) => (dispatch) => {
        fetch('/user/signup', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({user: {name: name, password: pwd}})
        }).then(res => res.json())
            .then(data => {
                if(data.success){
                    dispatch(loginControlAction.userRegisterSuccess(data.message));
                }else {
                    dispatch(loginControlAction.userRegisterFail(data.message))
                }
            })
    },
    userRegisterSuccess: (message) => ({
        type: 'USER_REGISTER_SUCCESS',
        payload:{
            message: message
        }
    }),
    userRegisterFail: (message) => ({
        type: 'USER_REGISTER_FAIL',
        payload:{
            message: message
        }
    })
};

export default loginControlAction;