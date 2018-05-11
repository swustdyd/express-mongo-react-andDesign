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
import UserListAction from '../../actions/user/userList'
import ModalAction from '../../actions/common/customModal'
import UserEdit from './userEdit'
import Common from '../../common/common'
import BaseConfig from '../../../../baseConfig'

import './userList.scss'

const FormItem = Form.Item;

class UserList extends React.Component{
    constructor(){
        super();
        this.state = {
            showIcon2X: false,
            icon2X: '',
            icon2XStyle: {}
        }
    }
    componentDidMount(){
        this.searchAndLoadUsers();
    }
    getSearchCondition(){
        return this.props.form.getFieldsValue();
    }
    handleSearchClick(e){
        e.preventDefault();
        this.searchAndLoadUsers(0, this.getSearchCondition())
    }
    searchAndLoadUsers(pageIndex, condition){
        const _this = this;
        _this.props.userListAction.searchUsers(condition, pageIndex, 5, (err, data) => {
            if(err){
                message.error(err.message)
            }else {
                if(data.success){
                    data.result.forEach(function (item) {
                        item.key = item._id;
                    });
                    _this.props.userListAction.loadUsersList(data.result, data.pageIndex, data.pageSize, data.total);
                }else {
                    message.error(data.message)
                }
            }
        });
    }
    handleEditClick(id){
        console.log(id);
        const condition = {
            _id: id
        };
        const _this = this;
        _this.props.userListAction.searchUsers(condition, 0, 10, (err, data) => {
            if(err){
                message.error(err.message);
            }else{
                if(data.success){
                    _this.props.modalAction.showModal({
                        title: `修改用户：${data.result[0].name}`,
                        maskClosable: true,
                        modalContent: <UserEdit
                            onSubmitSuccess={() => {
                                _this.props.modalAction.hideModal();
                                _this.searchAndLoadUsers(_this.props.userListState.pageIndex);
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
        const _this = this;
        _this.props.userListAction.deleteUser(id, (err, data) => {
            if(err){
                message.error(err.message);
            }else{
                if(data.success){
                    message.success(data.message);
                    _this.searchAndLoadUsers({}, _this.props.userListState.pageIndex);
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
        const {total, pageSize, pageIndex, users} = this.props.userListState;
        const { getFieldDecorator } = this.props.form;
        const { showIcon2X, icon2X, icon2XStyle} = this.state;
        const columns = [
            {
                title: '头像',
                dataIndex: 'icon',
                key: 'icon',
                render: (icon) => {
                    icon = (icon && icon.src) ? icon : { src: BaseConfig.userDefaultIcon };
                    return(
                        <img
                            onMouseEnter={(e) => {this.handleIconMouseEnter(icon, e)}}
                            onMouseLeave={(e) => {this.handleIconMouseLeave(icon, e)}}
                            className="list-user-icon" src={icon.src }
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
                dataIndex: 'meta',
                key: 'createAt',
                render: (meta) => { return Moment(meta.createAt).format('YYYY-MM-DD HH:mm:ss')}
            },
            {
                title: '更新日期',
                dataIndex: 'meta',
                key: 'updateAt',
                render: (meta) => { return Moment(meta.updateAt).format('YYYY-MM-DD HH:mm:ss')}
            },
            {
                title: '编辑',
                dataIndex: '_id',
                key: 'edit',
                render:  (id) => { return <Button type="primary" size="small" onClick={() => {this.handleEditClick(id)}}>编辑</Button>}
            },
            {
                title: '删除',
                dataIndex: '_id',
                key: 'delete',
                render: (text, record) => {
                    return (
                        <Popconfirm
                            title={`确认删除“${record.name}”？`}
                            cancelText="取消"
                            okText="确认"
                            onConfirm={() => {this.handleDeleteClick(text)}}
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
                _this.searchAndLoadUsers(pageIndex - 1, _this.getSearchCondition())
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
                    src={icon2X.src}
                />
            </Form>
        );
    }
}
const mapStateToPros = (state) => {
    return {
        userListState: state.user.userList
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        userListAction: bindActionCreators(UserListAction, dispatch),
        modalAction: bindActionCreators(ModalAction, dispatch)
    }
};

export default connect(mapStateToPros, mapDispatchToProps)(Form.create()(UserList));
//export default UserList;