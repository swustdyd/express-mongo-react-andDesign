/**
 * Created by Aaron on 2018/3/2.
 */

import React from 'react'
import { Table } from 'antd'
import Moment from 'moment'

class UserList extends React.Component{
    constructor(){
        super();
        this.state = {
            users: []
        }
    }
    componentDidMount(){
        let _this = this;
        fetch('/user/getUsers')
            .then(res => res.json())
            .then(data => {
                if(data.result && data.result.length > 0){
                    data.result.forEach(function (item) {
                        item.key = item._id;
                    });
                }
                //console.log(data.result);
                _this.setState({
                    users: data.result
                })
            });
    }
    render(){
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
        return(
            <div>
                <Table columns={columns} dataSource={this.state.users}/>
            </div>
        );
    }
}
export default UserList;