/**
 * Created by Aaron on 2018/3/1.
 */
import React from 'react'
import Layout from 'antd/lib/layout'
import Menu from 'antd/lib/menu'
const { Header, Content, Footer } = Layout;

class CustomLayout extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <Layout className="layout">
                <Header>
                    <div className="logo" >IMOOC</div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={this.props.defaultSelectedKeys}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="1"><a href="/">主页</a></Menu.Item>
                        <Menu.Item key="2"><a href="/movie/new.html">新增电影</a></Menu.Item>
                        <Menu.Item key="3"><a href="/movie/list.html">电影列表</a></Menu.Item>
                        <Menu.Item key="4"><a href="/user/list.html">用户列表</a></Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    {this.props.children}
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2016 Created by DYD
                </Footer>
            </Layout>
        );
    }
}
export default CustomLayout;
