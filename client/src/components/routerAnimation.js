import React from 'react'
import { withRouter }  from 'react-router'

let lastPath = '';
class RouterAnimation extends React.Component{
    constructor(props){
        super(props),
        this.state = {
            className: 'animation-hide'
        }
    }

    render(){
        const {children, animation, location} = this.props;        
        let {className} = this.state;
        const currentPath = location.pathname.split('/')[1];
        if(lastPath !== currentPath){
            lastPath = currentPath;
            setTimeout(() => {
                this.setState({
                    className: 'animation'
                })
            }, 0)      
            className = 'animation-hide'      
        }
        return(
            <div className={className}>
                {children}
            </div>
        );
    }
}

export default withRouter((props) => {
    return new RouterAnimation(props);
})