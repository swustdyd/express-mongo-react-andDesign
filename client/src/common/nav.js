/**
 * Created by Aaron on 2018/3/26.
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import { connect } from 'react-redux'
import HashRouterMenu from '../components/hashRouterMenu'
import LoginControl from '../containers/common/loginControl'

class Nav extends React.Component {

    renderItem(datas: []){
        const items = [];
        datas.forEach((item) => {
            items.push(
                <Menu.Item key={item.key}>
                    <Link to={item.path}>{item.text}</Link>
                </Menu.Item>
            )
        })
        return items;
    }

    render() {
        const logoStyle = {
            width: '120px',
            height: `${this.props.pageStyle.headerHeight}px`,
            float: 'left',
            textAlign: 'center',
            lineHeight: `${this.props.pageStyle.headerHeight}px`,
            color: '#ffffff',
            fontSize: '30px'
        };
        const {defaultKey, datas} = this.props;
        return (
            <div>
                <div style={logoStyle}>LOGO</div>
                <HashRouterMenu
                    theme="dark"
                    mode="horizontal"
                    defaultKeys={[defaultKey]}
                    style={{
                        lineHeight: `${this.props.pageStyle.headerHeight}px`,
                        border: 'none'
                    }}
                    level={1}
                >
                    {this.renderItem(datas)}
                    {/* <Menu.Item key="index"><Link to="/">主页</Link></Menu.Item>
                    <Menu.Item key="moviePage"><Link to="/moviePage/movieList">电影管理</Link></Menu.Item>
                    <Menu.Item key="userPage"><Link to="/userPage/userList">用户管理</Link></Menu.Item>
                    <Menu.Item key="routerTest"><Link to="/routerTest">RouterTest</Link></Menu.Item>
                    <Menu.Item key="canvas"><Link to="/canvas">Canvas</Link></Menu.Item> */}
                </HashRouterMenu>
                <LoginControl />
            </div>
        )
    }
}

const mapStateToPros = (state) => {
    return {
        pageStyle: state.style
    }
};

export default connect(mapStateToPros, undefined, undefined, { pure: false })(Nav)