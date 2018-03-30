/**
 * Created by Aaron on 2018/3/26.
 */
import React from 'react'
import { Link } from 'react-router-dom'
import {Menu} from 'antd'
import HashRouterMenu from './components/hashRouterMenu'
import LoginControl from './containers/common/loginControl'

class Nav extends React.Component{
    render(){
        return(
            <div>
                <div className="logo" >LOGO</div>
                <HashRouterMenu
                    theme="dark"
                    mode="horizontal"
                    defaultKeys={['index']}
                    style={{ lineHeight: '64px' }}
                    level={1}
                >
                    <Menu.Item key="index"><Link to="/">主页</Link></Menu.Item>
                    <Menu.Item key="moviePage"><Link to="/moviePage/movieList">电影管理</Link></Menu.Item>
                    <Menu.Item key="userPage"><Link to="/userPage/userList">用户管理</Link></Menu.Item>
                </HashRouterMenu>
                <LoginControl />
            </div>
        );
    }
}
export default Nav;