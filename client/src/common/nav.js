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
        return (
            <div>
                <div style={logoStyle}>LOGO</div>
                <HashRouterMenu
                    theme="dark"
                    mode="horizontal"
                    defaultKeys={['index']}
                    style={{
                        lineHeight: `${this.props.pageStyle.headerHeight}px`,
                        border: 'none'
                    }}
                    level={1}
                >
                    <Menu.Item key="index"><Link to="/">主页</Link></Menu.Item>
                    <Menu.Item key="moviePage"><Link to="/moviePage/movieList">电影管理</Link></Menu.Item>
                    <Menu.Item key="userPage"><Link to="/userPage/userList">用户管理</Link></Menu.Item>
                </HashRouterMenu>
                <LoginControl />
            </div>
        )
    }
}

const mapStateToPros = state => ({
    pageStyle: state.style
});

export default connect(mapStateToPros, undefined, undefined, { pure: false })(Nav)