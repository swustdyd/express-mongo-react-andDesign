import React from 'react'
import {Form, Button, Input, Icon} from 'antd'
import LoginControlAction from '../../actions/common/loginControl'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const FormItem = Form.Item;

class Login extends React.Component{
    handleLoginClick(e){
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, valus) => {
            if(!err){
                let userInput = this.props.form.getFieldsValue();
                this.props.loginControlAction.login(userInput.name, userInput.password);
            }
        });
    }
    render(){
        let {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleLoginClick.bind(this)} className="login-form">
                <FormItem>
                    {getFieldDecorator('name', {
                        rules:[
                            {
                                required: true,
                                message: '请输入用户名'
                            },
                            {
                                pattern: /^\w{3,10}$/,
                                message: '用户名只能是6-10位的字母、数字或者下划线'
                            }
                        ]
                    })(
                        <Input prefix={<Icon type="user" />} placeholder="用户名" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules:[
                            {
                                required: true,
                                message: '请输入密码'
                            }
                        ]
                    })(
                        <Input type='password' prefix={<Icon type="lock"/>} placeholder="密码" />
                    )}
                </FormItem>
                <FormItem >
                    <Button style={{width: '100%'}} type="primary" htmlType="submit" >登录</Button>
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

export default connect(mapStateToPros, mapDispatchToProps)(Form.create()(Login));

//export default Form.create()(Login);