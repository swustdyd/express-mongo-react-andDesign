/**
 * Created by Aaron on 2018/3/26.
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd'
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
        const {defaultKey, datas} = this.props;
        return (
            <div className="nav">
                <div className="logo">LOGO</div>
                <HashRouterMenu
                    className="hash-router-menu"
                    theme="dark"
                    mode="horizontal"
                    defaultKeys={[defaultKey]}
                    level={1}
                >
                    {this.renderItem(datas)}
                </HashRouterMenu>
                <LoginControl />
            </div>
        )
    }
}

export default Nav;