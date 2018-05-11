/**
 * Created by Aaron on 2018/3/2.
 */
import React from 'react'
import { Layout, Icon} from 'antd';
const { Sider } = Layout;
const { Content } = Layout;

class LRLayout extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            collapsed: false,
            fullScreen: false
        }
    }
    handleMenuIconClick(){
        this.setState({
            collapsed: !this.state.collapsed
        })
    }
    handleFullScreenIconClick(){
        this.setState({
            fullScreen: !this.state.fullScreen
        })
    }
    render() {
        const { collapsed, fullScreen} = this.state;
        return (
            <Layout className="lr-layout">
                <Sider
                    className="left-layout"
                    collapsed={this.state.collapsed}
                    collapsedWidth={30}
                >
                    <Icon
                        className="menu-icon"
                        type={collapsed ? 'menu-unfold' : 'menu-fold' }
                        onClick={() => {this.handleMenuIconClick()}}
                    />
                    {this.props.left}
                </Sider>
                <Layout className={`right-layout ${fullScreen ? 'right-layout-full' : ''}`} >
                    <Icon
                        className="full-screen-icon"
                        type={fullScreen ? 'shrink' : 'arrows-alt'}
                        onClick={() => {this.handleFullScreenIconClick()}}
                    />
                    <Content>
                        {this.props.right}
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
export default LRLayout;