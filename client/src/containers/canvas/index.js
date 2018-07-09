import React from 'react'
import { Route, Link } from 'react-router-dom'
import LRLayout from '../../common/lrLayout'
import {Menu } from 'antd'
import HashRouterMenu from '../../components/hashRouterMenu'
import AnimationPage from './animationPage'
import Canvas3D from './canvas3D'

class CanvasPage extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <LRLayout
                left={
                    <HashRouterMenu
                        mode="inline"
                        defaultKeys={['animation']}
                        style={{ height: '100%', borderRight: 0 }}
                        level={2}
                    >
                        <Menu.Item key="animation"><Link to="/canvas/animation" >animation</Link></Menu.Item>
                        <Menu.Item key="3d"><Link to="/canvas/3d" >3d</Link></Menu.Item>
                    </HashRouterMenu>
                }
                right={
                    <div>
                        <Route path="/canvas" exact component={AnimationPage}/>
                        <Route path="/canvas/animation" component={AnimationPage}/>
                        <Route path="/canvas/3d" component={Canvas3D}/>
                    </div>
                }
            />
        );
    }
}
export default CanvasPage;