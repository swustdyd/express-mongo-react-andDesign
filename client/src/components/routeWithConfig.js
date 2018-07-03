import React from 'react'
import { Route, Link } from 'react-router-dom'

export default class RouteWithConfig extends React.Component{

    // resetConfig(config = [], root = ''){
    //     const newConfig = config.map((item) => {
    //         const newItem = Object.assign({}, item, {path: root + item.path})   
    //         if(newItem.children && newItem.children.length > 0){
    //             newItem.children = this.resetConfig(newItem.children, newItem.path);
    //         }      
    //         return newItem;
    //     });
    //     return newConfig;
    // }

    renderRoute(config = [], basePath){
        const routes = [];    
        config.forEach((item) => { 
            const newPath = basePath + item.path;
            routes.push(<Route path={newPath} component={item.component}/>);
            if(item.children && item.children.length > 0){
                routes.push(...this.renderRoute(item.children, newPath));
            }
        });
        return routes;
    }

    render(){
        const {config, basePath} = this.props;
        return (
            <div className="router-page">
                {this.renderRoute(config, basePath)}
            </div>
        );
    }
}