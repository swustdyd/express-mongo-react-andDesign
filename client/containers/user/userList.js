/**
 * Created by Aaron on 2018/3/2.
 */

import React from 'react'
import { Table, message, Button, Popconfirm, Form } from 'antd'
import Moment from 'moment'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import UserListAction from '../../actions/user/userList'
import ModalAction from '../../actions/common/customModal'
import UserEdit from './userEdit'

let FormItem = Form.Item;

class UserList extends React.Component{
    constructor(){
        super();
    }
    componentDidMount(){
        this.searchAndLoadUsers();
    }

    searchAndLoadUsers(condition, pageIndex){
        let _this = this;
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
        let condition = {
            _id: id
        };
        let _this = this;
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
        let _this = this;
        _this.props.userListAction.deleteUser(id, (err, data) =>{
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
    render(){
        let {total, pageSize, pageIndex, users} = this.props.userListState;
        let columns = [
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
                render: meta => Moment(meta.createAt).format('YYYY-MM-DD HH:mm:ss')
            },
            {
                title: '更新日期',
                dataIndex: 'meta',
                key: 'updateAt',
                render: meta => Moment(meta.updateAt).format('YYYY-MM-DD HH:mm:ss')
            },
            {
                title: '编辑',
                dataIndex: '_id',
                key: 'edit',
                render:  id => <Button type="primary" size="small" onClick={this.handleEditClick.bind(this, id)}>编辑</Button>
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
                            onConfirm={this.handleDeleteClick.bind(this, text)}
                        >
                            <Button type="danger" size="small">删除</Button>
                        </Popconfirm>
                    );
                }
            }
        ];
        let pagination = {
            total: total,
            pageSize: pageSize,
            current: pageIndex + 1,
            onChange: (pageIndex) => {
                _this.searchAndLoadUsers(pageIndex - 1)
            }
        };
        return(
            <Form>
                <Table
                    columns={columns}
                    dataSource={users}
                    pagination={pagination}
                />
            </Form>
        );
    }
}
const mapStateToPros = state => ({
    userListState: state.user.userList
});

const mapDispatchToProps = dispatch => ({
    userListAction: bindActionCreators(UserListAction, dispatch),
    modalAction: bindActionCreators(ModalAction, dispatch)
});

export default connect(mapStateToPros, mapDispatchToProps)(Form.create()(UserList));
//export default UserList;