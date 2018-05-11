import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoginControlAction from '../../actions/common/loginControl'
import ModalAction from '../../actions/common/customModal'
import Login from './login'
import ModifyPwd from './modifyPwd'
import UserRegister from './userRegister'
import { message } from 'antd'
import BaseConfig from '../../../../baseConfig'

import './loginControl.scss'

class LoginControl extends React.Component{
    constructor(){
        super()
    }
    handleLoginClick(){
        this.props.modalAction.showModal({
            title: '登录',
            maskClosable: true,
            modalContent: <Login />,
            width: 500
        });
    }
    handleLogoutClick(){
        this.props.loginControlAction.logout();
    }
    componentDidMount(){
        //console.log('loginControl render');
        this.props.loginControlAction.checkLogin();
    }
    handleModifyPwdClick(){
        this.props.modalAction.showModal({
            title: '修改密码',
            maskClosable: true,
            modalContent: <ModifyPwd />,
            width: 500
        });
    }
    handleRegisterClick(){
        this.props.modalAction.showModal({
            title: '注册',
            maskClosable: false,
            modalContent: <UserRegister />,
            width: 500
        });
    }
    componentWillUpdate(nextProps){
        if(nextProps.loginState.actionSuccess){
            nextProps.modalAction.hideModal();
            if(nextProps.loginState.message){
                message.success(nextProps.loginState.message);
            }
        }else{
            if(nextProps.loginState.message){
                message.error(nextProps.loginState.message);
            }
        }
    }
    render(){
        const { loginState } = this.props;
        return(
            <div className="login-control">
                {
                    loginState.hasLogin ?
                        <div>
                            <img
                                className="user-icon"
                                src={
                                    loginState.user.icon && loginState.user.icon.src ?
                                        loginState.user.icon.src
                                        :
                                        BaseConfig.userDefaultIcon
                                }
                            />
                            <span>欢迎您，{loginState.user.name}</span>
                            &emsp;|&emsp;
                            <a onClick={this.handleLogoutClick.bind(this)}>登出</a>
                            &emsp;|&emsp;
                            <a onClick={this.handleModifyPwdClick.bind(this)}>修改密码</a>
                        </div>
                        :
                        <div>
                            <a onClick={this.handleLoginClick.bind(this)}>登录</a>
                            &emsp;|&emsp;
                            <a onClick={this.handleRegisterClick.bind(this)}>注册</a>
                        </div>
                }
            </div>
        );
    }
}

const mapStateToPros = (state) => {
    return {
        loginState: state.common.login
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginControlAction: bindActionCreators(LoginControlAction, dispatch),
        modalAction:  bindActionCreators(ModalAction, dispatch)
    }
};

export default connect(mapStateToPros, mapDispatchToProps)(LoginControl);