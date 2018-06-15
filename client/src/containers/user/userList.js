/**
 * Created by Aaron on 2018/3/2.
 */

import React from 'react'
import { Table, message, Button,
    Popconfirm, Form, Select,
    Col, Input, Row, Divider
} from 'antd'
import Moment from 'moment'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import UserAction from '../../actions/user/userAction'
import ModalAction from '../../actions/common/customModal'
import UserEdit from './userEdit'
import Common from '../../common/common'
import {userDefaultIcon, staticSourceHost} from '../../../../baseConfig'

import './userList.scss'

const FormItem = Form.Item;

class UserList extends React.Component{
    constructor(){
        super();
        this.state = {
            showIcon2X: false,
            icon2X: '',
            icon2XStyle: {},
            total: 0,
            pageIndex: 0,
            pageSize: 10,
            users: []
        }
    }
    componentDidMount(){
        this.searchAndLoadUsers();
    }
    getSearchCondition(){
        const condition = this.props.form.getFieldsValue();
        condition.name = condition.searchName;
        condition.role = condition.searchRole;
        return condition;
    }
    handleSearchClick(e){
        e.preventDefault();
        this.searchAndLoadUsers(0, this.getSearchCondition())
    }
    searchAndLoadUsers(pageIndex = 0, condition){
        const {pageSize} = this.state;
        this.props.userAction.searchUsers(condition, pageIndex, pageSize, (err, data) => {
            if(err){
                message.error(err.message)
            }else {
                if(data.success){
                    this.setState({
                        pageIndex,
                        total: data.total,
                        users: data.result
                    })
                }else {
                    message.error(data.message)
                }
            }
        });
    }
    handleEditClick(id){
        const {pageIndex, pageSize} = this.state;
        const condition = {
            userId: id
        };
        this.props.userAction.searchUsers(condition, 0, pageSize, (err, data) => {
            if(err){
                message.error(err.message);
            }else{
                if(data.success){
                    this.props.modalAction.showModal({
                        title: `修改用户：${data.result[0].name}`,
                        maskClosable: true,
                        modalContent: <UserEdit
                            onSubmitSuccess={() => {
                                this.props.modalAction.hideModal();
                                this.searchAndLoadUsers(pageIndex, this.getSearchCondition());
                            }}
                            initData={data.result[0]}
                        />
                    });
                }else {
                    message.error(data.message);
                }
            }
        });
    }
    handleDeleteClick(id){
        this.props.userAction.deleteUser(id, (err, data) => {
            if(err){
                message.error(err.message);
            }else{
                if(data.success){
                    message.success(data.message);
                    this.searchAndLoadUsers(pageIndex, this.getSearchCondition());
                }else{
                    message.error(data.message);
                }
            }
        })
    }
    handleIconMouseEnter(icon, e){
        this.setState({
            showIcon2X: true,
            icon2X: icon,
            icon2XStyle: {
                left: e.clientX,
                top: e.clientY
            }
        })
    }
    handleIconMouseLeave(icon, e){
        this.setState({
            showIcon2X: false
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const { showIcon2X, icon2X, icon2XStyle, total, pageSize, pageIndex, users} = this.state;
        const columns = [
            {
                title: '头像',
                dataIndex: 'icon',
                key: 'icon',
                render: (icon) => {
                    icon = icon ? `${staticSourceHost}${icon}` : userDefaultIcon;
                    return(
                        <img
                            onMouseEnter={(e) => {this.handleIconMouseEnter(icon, e)}}
                            onMouseLeave={(e) => {this.handleIconMouseLeave(icon, e)}}
                            className="list-user-icon" src={icon }
                        />
                    )
                }
            },
            {
                title: '用户名',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '角色',
                dataIndex: 'role',
                key: 'role',
                render: (role) => {
                    switch (role){
                        case 10:
                            return '管理员';
                        case 50:
                            return '超级管理员';
                        default:
                            return '普通用户';
                    }
                }
            },
            {
                title: '创建日期',
                dataIndex: 'createAt',
                key: 'createAt',
                render: (createAt) => { return Moment(createAt).format('YYYY-MM-DD HH:mm:ss')}
            },
            {
                title: '更新日期',
                dataIndex: 'updateAt',
                key: 'updateAt',
                render: (updateAt) => { return Moment(updateAt).format('YYYY-MM-DD HH:mm:ss')}
            },
            {
                title: '编辑',
                dataIndex: 'userId',
                key: 'edit',
                render:  (id) => { return <Button type="primary" size="small" onClick={() => {this.handleEditClick(id)}}>编辑</Button>}
            },
            {
                title: '删除',
                dataIndex: 'userId',
                key: 'delete',
                render: (id, record) => {
                    return (
                        <Popconfirm
                            title={`确认删除“${record.name}”？`}
                            cancelText="取消"
                            okText="确认"
                            onConfirm={() => {this.handleDeleteClick(id)}}
                        >
                            <Button type="danger" size="small">删除</Button>
                        </Popconfirm>
                    );
                }
            }
        ];
        const pagination = {
            total: total,
            pageSize: pageSize,
            current: pageIndex + 1,
            onChange: (pageIndex) => {
                this.searchAndLoadUsers(pageIndex - 1, this.getSearchCondition())
            }
        };
        const formItemLayout = {
            labelCol:{
                span: 4
            },
            wrapperCol: {
                span: 20
            }
        };
        return(
            <Form onSubmit={this.handleSearchClick.bind(this)}>
                <Row gutter={12}>
                    <Col xl={6}>
                        <FormItem {...formItemLayout} label="用户名">
                            {getFieldDecorator('searchName')(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col xl={6}>
                        <FormItem {...formItemLayout} label="角色">
                            {getFieldDecorator('searchRole')(
                                <Select allowClear>{Common.createUserRoleOptions()}</Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Button type="primary" htmlType="submit" icon="search">搜索</Button>
                </Row>
                <Divider />
                <Table
                    columns={columns}
                    dataSource={users}
                    pagination={pagination}
                />
                <img
                    className={`user-icon-2x ${showIcon2X ? 'show' : ''}`}
                    style={icon2XStyle}
                    src={icon2X}
                />
            </Form>
        );
    }
}
const mapStateToPros = (state) => {
    return {
        userState: state.user
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        userAction: bindActionCreators(UserAction, dispatch),
        modalAction: bindActionCreators(ModalAction, dispatch)
    }
};

export default connect(mapStateToPros, mapDispatchToProps)(Form.create()(UserList));
//export default UserList;