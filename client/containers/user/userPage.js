import React from 'react'
import { Route, Link } from 'react-router-dom'
import LRLayout from '../../lrLayout'
import {Menu } from 'antd'
import HashRouterMenu from '../../components/hashRouterMenu'
import UserList from './userList'
import UserEdit from './userEdit'
import UserCount from './userCount'

class UserPage extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <LRLayout
                left={
                    <HashRouterMenu
                        mode="inline"
                        defaultKeys={['userList']}
                        style={{ height: '100%', borderRight: 0 }}
                        level={2}
                    >
                        <Menu.Item key="userList"><Link to="/userPage/userList" >用户列表</Link></Menu.Item>
                        {/*<Menu.Item key="userCount"><Link to="/userPage/userCount" >统计</Link></Menu.Item>*/}
                    </HashRouterMenu>
                }
                right={
                    <div>
                        <Route path="/userPage/userList" component={UserList}/>
                    </div>
                }
            />
        );
    }
}
export default UserPage;