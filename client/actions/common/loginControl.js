import Common from '../../common/common'

const loginControlAction = {
    login: (name, password) =>(dispatch, getState) => {
        fetch('/user/signin', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            //同域名下，会带上cookie，否则后端根据sessionid获取不到对应的session
            credentials: 'include',
            body: JSON.stringify({user: {name: name, password: password}})
        })
        .then(res => res.json())
        .then((data) => {
            if(data.success){
                dispatch(loginControlAction.loginSuccess(name))
            }else {
                console.log(data);
                dispatch(loginControlAction.loginFail(data.message))
            }
        });
    },
    logout: () => (dispatch, getState) =>{

    },
    loginSuccess: (name) =>({
        type: 'LOGIN_SUCCESS',
        payload: {
            name: name
        }
    }),
    loginFail: (message) =>({
        type: 'LOGIN_FAIL',
        payload: {
            message: message
        }
    }),
    logoutSuccess: () =>({
        type: 'LOGOUT_SUCCESS'
    }),
};

export default loginControlAction;