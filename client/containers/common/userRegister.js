/**
 * Created by Aaron on 2018/3/13.
 */
import React from 'react'
import {Form, Button, Input, Icon, Select} from 'antd'
import LoginControlAction from '../../actions/common/loginControl'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

let FormItem = Form.Item;
let Option = Select.Option;

class UserRegister extends React.Component{
    handleRegisterClick(e){
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, valus) => {
            if(!err){
                let userInput = this.props.form.getFieldsValue();
                this.props.loginControlAction.userRegister(userInput.name, userInput.password);
            }
        });
    }
    checkPwd(rule, value, callback){
        const form = this.props.form;
        let confirmPwd = form.getFieldValue('confirmPwd')
        if (value && confirmPwd) {
            form.validateFields(['confirmPwd'], { force: true });
        }
        callback();
    }
    checkConfirmPwd(rule, value, callback){
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('确认密码与密码不一致');
        } else {
            callback();
        }
    }
    render(){
        let {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleRegisterClick.bind(this)} className="userRegister-form">
                <FormItem>
                    {getFieldDecorator(`name`, {
                        rules:[
                            {
                                required: true,
                                message: '请输入用户名'
                            },
                            {
                                pattern: /^\w{3,20}$/,
                                message: '用户名只能是3-20位的字母、数字或者下划线'
                            }
                        ]
                    })(
                        <Input prefix={<Icon type="user" />} placeholder="用户名" />
                    )}
                </FormItem>
                {/*<FormItem>
                    {getFieldDecorator(`role`)(
                        <Select allowClear placeholder="请选择一个角色">
                            <Option value="0">普通用户</Option>
                            <Option value="10" disabled>管理员</Option>
                            <Option value="50" disabled>超级管理员</Option>
                        </Select>
                    )}
                </FormItem>*/}
                <FormItem>
                    {getFieldDecorator(`password`,{
                        rules:[
                            {
                                required: true,
                                message: '请输入密码'
                            },
                            {
                                validator: this.checkPwd.bind(this)
                            }
                        ]
                    })(
                        <Input type='password' prefix={<Icon type="lock"/>} placeholder="密码" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator(`confirmPwd`,{
                        rules:[
                            {
                                required: true,
                                message: '请输入确认密码'
                            },
                            {
                                validator: this.checkConfirmPwd.bind(this)
                            }
                        ]
                    })(
                        <Input type='password' prefix={<Icon type="lock"/>} placeholder="确认密码" />
                    )}
                </FormItem>
                <FormItem >
                    <Button style={{width: '100%'}} type="primary" htmlType="submit" >注册</Button>
                </FormItem>
            </Form>
        )
    }
}
const mapStateToPros = state => ({
    loginState: state.common.login
});

const mapDispatchToProps = dispatch => ({
    loginControlAction: bindActionCreators(LoginControlAction, dispatch)
});

export default connect(mapStateToPros, mapDispatchToProps)(Form.create()(UserRegister));