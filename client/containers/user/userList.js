/**
 * Created by Aaron on 2018/3/2.
 */

import React from 'react'
import { Table, message } from 'antd'
import Moment from 'moment'
import Common from '../../common/common'

class UserList extends React.Component{
    constructor(){
        super();
        this.state = {
            total: 0,
            pageIndex: 0,
            pageSize: 0,
            users: []
        }
    }
    componentDidMount(){
        let _this = this;
        fetch('/user/getUsers', {credentials: 'include'})
        .then(res => res.json())
        .then(data => {
            if(data.success){
                if(data.result && data.result.length > 0){
                    data.result.forEach(function (item) {
                        item.key = item._id;
                    });
                }
                _this.setState({
                    total: data.total,
                    pageIndex: data.pageIndex,
                    pageSize: data.pageSize,
                    users: data.result
                })
            }else{
                message.error(data.message);
            }
        }).catch((err) =>{
            console.log(err)
        });
    }
    render(){
        let {total, pageSize, pageIndex} = this.state;
        let columns = [{
            title: '用户名',
            dataIndex: 'name',
            key: 'name'
        },{
            title: '创建日期',
            dataIndex: 'meta',
            key: 'createAt',
            render: meta => Moment(meta.createAt).format('YYYY-MM-DD HH:mm:ss')
        }
        ,{
            title: '更新日期',
            dataIndex: 'meta',
            key: 'updateAt',
            render: meta => Moment(meta.updateAt).format('YYYY-MM-DD HH:mm:ss')
        }];
        let pagination = {
            total: total,
            pageSize: pageSize,
            current: pageIndex + 1,
            onChange: (pageIndex) => {
                _this.searchAndLoadMovies(pageIndex - 1, condition)
            }
        };
        return(
            <div>
                <Table
                    columns={columns}
                    dataSource={this.state.users}
                    pagination={pagination}
                />
            </div>
        );
    }
}
export default UserList;