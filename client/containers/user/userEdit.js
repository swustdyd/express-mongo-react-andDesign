/**
 * Created by Aaron on 2018/3/13.
 */
import React from 'react'
import {Form, Button, Input, Icon, Select, Spin} from 'antd'

let FormItem = Form.Item;
let Option = Select.Option;

class UserEdit extends React.Component{
    constructor(props){
        super(props);
        let { initData } = this.props;
        this.state = {
            submiting: false,
            initData: initData || {}
        };
    }
    handleSubmitClick(e){
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, valus) => {
            if(!err){

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
                                    pattern: /^\w{3,10}$/,
                                    message: '用户名只能是3-10位的字母、数字或者下划线'
                                }
                            ],
                            initialValue: initData.name
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="角色">
                        {getFieldDecorator(`role`,{
                            initialValue: initData.role
                        })(
                            <Select
                                allowClear
                                placeholder="请选择一个角色"
                            >
                                <Option value="0">普通用户</Option>
                                <Option value="10">管理员</Option>
                                <Option value="50">超级管理员</Option>
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