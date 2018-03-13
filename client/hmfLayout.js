/**
 * Created by Aaron on 2018/3/1.
 */
import React from 'react'
import { Link } from 'react-router-dom'
import {Layout, Menu} from 'antd'
import HashRouterMenu from './components/hashRouterMenu'
import LoginControl from './containers/common/loginControl'

const { Header, Content, Footer } = Layout;

class CustomLayout extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <Layout className="layout">
                <Header ref="header">
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
                    <LoginControl/>
                </Header>
                <Content style={{ padding: '0 50px', minHeight: 680 }}>
                    {this.props.children}
                </Content>
                <Footer ref="footer" style={{ textAlign: 'center'}}>
                    Ant Design ©2016 Created by AaronDeng
                </Footer>
            </Layout>
        );
    }
}
export default CustomLayout;
