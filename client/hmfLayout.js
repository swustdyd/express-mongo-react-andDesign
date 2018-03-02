/**
 * Created by Aaron on 2018/3/1.
 */
import React from 'react'
import { Link } from 'react-router-dom'
import {Layout, Menu} from 'antd'
import Common from './common/common'

const { Header, Content, Footer } = Layout;

class CustomLayout extends React.Component{
    constructor(props){
        super(props);
        //根据当前路径，初始化一级导航的当前项
        let paths = Common.getHashPath(window.location.href);
        let currentKey = paths[0] ? paths[0] : 'index';
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
            <Layout className="layout">
                <Header>
                    <div className="logo" >LOGO</div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        onClick={this.handleMenuClick}
                        selectedKeys={[this.state.currentKey]}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="index"><Link to="/">主页</Link></Menu.Item>
                        <Menu.Item key="moviePage"><Link to="/moviePage/movieList">电影管理</Link></Menu.Item>
                        <Menu.Item key="userPage"><Link to="/userPage/userList">用户管理</Link></Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    {this.props.children}
                </Content>
                <Footer style={{ textAlign: 'center'}}>
                    Ant Design ©2016 Created by AaronDeng
                </Footer>
            </Layout>
        );
    }
}
export default CustomLayout;
