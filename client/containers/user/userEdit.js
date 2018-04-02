/**
 * Created by Aaron on 2018/3/13.
 */
import React from 'react'
import {Form, Button, Input, Icon, Select, Spin, message} from 'antd'
import Common from '../../common/common'

let FormItem = Form.Item;
let Option = Select.Option;

class UserEdit extends React.Component{
    constructor(props){
        super(props);
        let { initData } = props;
        this.state = {
            submiting: false,
            initData: initData || {}
        };
    }
    handleSubmitClick(e){
        e.preventDefault();
        let _this = this;
        _this.props.form.validateFieldsAndScroll((err, valus) => {
            if(!err){
                let userInput = this.props.form.getFieldsValue();
                userInput._id = _this.state.initData._id;
                fetch('/user/edit',{
                    method: 'post',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    //同域名下，会带上cookie，否则后端根据sessionid获取不到对应的session
                    credentials: 'include',
                    body: JSON.stringify({user: userInput})
                })
                .then(res => res.json())
                .then(data => {
                    if(data.success){
                        message.success(data.message);
                        if(_this.props.onSubmitSuccess){
                            _this.props.onSubmitSuccess();
                        }
                    }else {
                        message.error(data.message);
                        if(_this.props.onSubmitFail){
                            _this.props.onSubmitFail();
                        }
                    }
                }).catch(err => {
                    message.error(err.message);
                });
                console.log(userInput);
            }
        });
    }
    render(){
        let {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 12,
                },
                sm: {
                    span: 24,
                    offset: 20,
                },
            },
        };
        let { initData } = this.state;
        return (
            <Spin tip="提交中..." spinning={this.state.submiting}>
                <Form onSubmit={this.handleSubmitClick.bind(this)} className="userEdit-form">
                    <FormItem {...formItemLayout} label="用户名">
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
                            ],
                            initialValue: initData.name
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="角色">
                        {getFieldDecorator(`role`,{
                            rules: [{
                                required: true,
                                message: '请一个选择角色'
                            }],
                            initialValue: initData.role
                        })(
                            <Select
                                allowClear
                            >
                                {/*<Option value="0">普通用户</Option>
                                <Option value="10">管理员</Option>
                                <Option value="50">超级管理员</Option>*/}
                                {Common.createUserRoleOptions()}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" >确认修改</Button>
                    </FormItem>
                </Form>
            </Spin>
        )
    }
}

export default Form.create()(UserEdit);