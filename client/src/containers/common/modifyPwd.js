/**
 * Created by Aaron on 2018/3/13.
 */
import React from 'react'
import {Form, Button, Input, Icon, Col} from 'antd'
import LoginControlAction from '../../actions/common/loginControl'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const FormItem = Form.Item;

class ModifyPwd extends React.Component{
    handleModifyClick(e){
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, valus) => {
            if(!err){
                const userInput = this.props.form.getFieldsValue();
                this.props.loginControlAction.modifyPwd(userInput.originPwd, userInput.newPwd);
            }
        });
    }
    checkNewPwd(rule, value, callback){
        const {form} = this.props;
        const confirmPwd = form.getFieldValue('confirmPwd')
        if (value && confirmPwd) {
            form.validateFields(['confirmPwd'], { force: true });
        }
        callback();
    }
    checkConfirmPwd(rule, value, callback){
        const {form} = this.props;
        if (value && value !== form.getFieldValue('newPwd')) {
            callback('确认密码与原密码不一致');
        } else {
            callback();
        }
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleModifyClick.bind(this)} className="modifyPwd-form">
                <FormItem>
                    {getFieldDecorator('originPwd', {
                        rules:[
                            {
                                required: true,
                                message: '请输入原密码'
                            }
                        ]
                    })(
                        <Input type="password" prefix={<Icon type="lock" />} placeholder="原密码" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('newPwd', {
                        rules:[
                            {
                                required: true,
                                message: '请输入新密码'
                            },
                            {
                                validator: this.checkNewPwd.bind(this)
                            }
                        ]
                    })(
                        <Input type='password' prefix={<Icon type="lock"/>} placeholder="新密码" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('confirmPwd', {
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
                    <Button style={{width: '100%'}} type="primary" htmlType="submit" >确认修改</Button>
                </FormItem>
            </Form>
        )
    }
}

const mapStateToPros = (state) => {
    return {
        loginState: state.common.login
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginControlAction: bindActionCreators(LoginControlAction, dispatch)
    }
};

export default connect(mapStateToPros, mapDispatchToProps)(Form.create()(ModifyPwd));