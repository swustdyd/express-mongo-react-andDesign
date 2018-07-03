import React from 'react'
import { withRouter }  from 'react-router'
import { Link } from 'react-router-dom'

const rebuildConfig = (config = [], basePath = '', baseName = '', router = {}) => {
    config.forEach((item) => {
        const pathname = basePath + item.path;
        baseName = baseName ? `${baseName}&&` : '';
        router[pathname] = `${baseName}${pathname}&${item.text || 'no route name'}`;
        if(item.children && item.children.length > 0){
            rebuildConfig(item.children, pathname, router[pathname], router);
        }
    })
    return router;
}

class Breadcrumb extends React.Component{

    constructor(props){
        super(props);
        const {config, basePath} = this.props;
        const router = rebuildConfig(config, basePath);
        this.state = {
            router
        }
    }
    
    renderBreadcrumb(router = {}, currentPathname = ''){
        let breadcrumbArray = [];
        const text = router[currentPathname];
        if(text){            
            breadcrumbArray = text.split('&&');            
            breadcrumbArray = breadcrumbArray.map((item, index) => {
                const path = item.split('&')[0];
                const showText = item.split('&')[1];
                let showItem = <Link to={path} className="Breadcrumb-text">{showText}</Link>;
                if(index !== 0){
                    showItem = 
                        <span>
                            <span className="Breadcrumb-split">></span>
                            <Link to={path} className="Breadcrumb-text">{showText}</Link>
                        </span>
                }                
                return showItem;
            });
        }
        return breadcrumbArray;
    }

    render(){
        const {config, basePath, location} = this.props;
        const {router} = this.state;
        return(
            <div>
                {this.renderBreadcrumb(router, location.pathname)}
            </div>
        )
    }
}

export default withRouter((props) => {
    return new Breadcrumb(props);
})