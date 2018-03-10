import React from 'react'
import { Route, Link } from 'react-router-dom'
import LRLayout from '../../lrLayout'
import { Layout, Menu } from 'antd'
import UserList from './userList'
import UserEdit from './userEdit'
import UserCount from './userCount'
import Common from '../../common/common'

class UserPage extends React.Component{
    constructor(props){
        super(props);
        //根据当前路径，初始化二级导航的当前项
        let paths = Common.getHashPath( window.location.href);
        let currentKey = paths[1];
        this.state = {
            currentKey: currentKey
        };
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }
    handleMenuClick(e){
        this.setState({
            currentKey: e.key
        })
    }
    render(){
        return(
            <LRLayout
                left={
                    <Menu
                        mode="inline"
                        onClick={this.handleMenuClick}
                        selectedKeys={[this.state.currentKey]}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        <Menu.Item key="userList"><Link to="/userPage/userList" >用户列表</Link></Menu.Item>
                        <Menu.Item key="userNew"><Link to="/userPage/userNew" >新增用户</Link></Menu.Item>
                        <Menu.Item key="userCount"><Link to="/userPage/userCount" >统计</Link></Menu.Item>
                    </Menu>
                }
                right={
                    <div>
                        <Route path="/userPage/userList" component={UserList}/>
                        <Route path="/userPage/userNew" component={UserEdit}/>
                        <Route path="/userPage/userCount" component={UserCount}/>
                    </div>
                }
            />
        );
    }
}
export default UserPage;