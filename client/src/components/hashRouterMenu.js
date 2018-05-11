/**
 * Created by Aaron on 2018/3/13.
 */
import React from 'react'
import {Menu} from 'antd'
import Common from '../common/common'

class HashRouterMenu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentKey: Common.getCurrentMenuKey(this.props)
        };
    }

    handleMenuClick(e){
        this.setState({
            currentKey: e.key
        })
    }

    componentWillUpdate(nextProps, nextState){
        const currentKey = Common.getCurrentMenuKey(nextProps);
        Object.assign(nextState, {currentKey: currentKey});
    }

    render(){
        return(
            <Menu {...this.props} selectedKeys={[this.state.currentKey]} onClick={this.handleMenuClick.bind(this)}>
                {this.props.children}
            </Menu>
        );
    }
}

export default HashRouterMenu;