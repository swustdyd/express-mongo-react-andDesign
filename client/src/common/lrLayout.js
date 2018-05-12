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
            fullScreen: false,
            setFullScreenStartPosition: false 
        }
    }
    handleMenuIconClick(){
        this.setState({
            collapsed: !this.state.collapsed
        })
    }
    handleFullScreenIconClick(){
        const {fullScreen} = this.state;
        if(!fullScreen){
            setTimeout(() => {
                this.setState({
                    setFullScreenStartPosition: false
                });
            }, 0);
        }
        this.setState({
            fullScreen: !fullScreen,
            setFullScreenStartPosition: !fullScreen
        })
    }
    render() {
        const { collapsed, fullScreen, setFullScreenStartPosition} = this.state;
        let layoutClassName = 'right-layout';
        if(fullScreen){
            layoutClassName += ' right-layout-full';
        }
        if(setFullScreenStartPosition){
            layoutClassName += ' right-layout-full-position';
        }
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
                <Layout className={layoutClassName} >
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