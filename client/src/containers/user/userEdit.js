/**
 * Created by Aaron on 2018/3/13.
 */
import React from 'react'
import {Form, Button, Input, Select, Spin, message, Tooltip, Icon} from 'antd'
import Common from '../../common/common'
import PicturesWall from '../../components/picturesWall'
import UserAction from '../../actions/user/userAction'
import API from '../../common/api'
import path from 'path'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {staticSourceHost} from '../../../../baseConfig'

const FormItem = Form.Item;

class UserEdit extends React.Component{
    constructor(props){
        super(props);
        let iconList = [];
        let { initData } = props;
        initData = initData || {};
        if(initData.icon){            
            iconList = [{
                uid: 0,
                name: path.basename(initData.icon),
                status: 'done',
                url: `${staticSourceHost}${initData.icon}`
            }]
        }
        this.state = {
            submiting: false,
            initData,
            iconList
        };
    }
    handleSubmitClick(e){
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, valus) => {
            if(!err){
                const userInput = this.props.form.getFieldsValue();
                userInput.userId = this.state.initData.userId;
                const { iconList } = this.state;
                if(iconList.length > 0){
                    const parseResult = Common.parseUrl(iconList[0].url);
                    userInput.icon = parseResult ? `/${parseResult.path}` : '';
                }else{
                    userInput.icon = '';
                }
                this.props.userAction.editUser(userInput, (err, data) => {
                    if(err){
                        message.success(err.message);
                    }else if(data.success){
                        message.success(data.message);
                        if(this.props.onSubmitSuccess){
                            this.props.onSubmitSuccess(data);
                        }
                    }else {
                        message.error(data.message);
                        if(this.props.onSubmitFail){
                            this.props.onSubmitFail(data);
                        }
                    }
                })
            }
        });
    }

    handleIconUploadChange(iconList){
        this.setState({
            iconList: iconList
        })
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const { initData, iconList } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 }
            }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 12
                },
                sm: {
                    span: 24,
                    offset: 20
                }
            }
        };
        return (
            <Spin tip="提交中..." spinning={this.state.submiting}>
                <Form onSubmit={this.handleSubmitClick.bind(this)} className="userEdit-form">
                    <FormItem {...formItemLayout} label="用户名">
                        {getFieldDecorator('name', {
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
                        {getFieldDecorator('role', {
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
                    <FormItem
                        {...formItemLayout}
                        label={(
                            <span>
                                头像&nbsp;
                                <Tooltip title="文件格式：JPG、PNG">
                                    <Icon type="question-circle-o" />
                                </Tooltip>
                            </span>
                        )}
                    >
                        <PicturesWall
                            name="userIcon"
                            action={API.uploadIcon}
                            cutAction={API.cutImg}
                            cutWidth={250}
                            cutHeight={250}
                            maxLength={1}
                            defaultFileList={iconList}
                            onChange={(list) => {this.handleIconUploadChange(list)}}
                        />
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" >确认修改</Button>
                    </FormItem>
                </Form>
            </Spin>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        userAction: bindActionCreators(UserAction, dispatch)
    }
};

export default connect(undefined, mapDispatchToProps)(Form.create()(UserEdit));