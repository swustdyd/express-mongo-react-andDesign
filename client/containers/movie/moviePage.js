/**
 * Created by Aaron on 2018/1/4.
 */
import '../../common/common'
import React from 'react'
import { Route, Link } from 'react-router-dom'
import LRLayout from '../../lrLayout'
import HashRouterMenu from '../../components/hashRouterMenu'
import {Menu } from 'antd'
import { asyncComponent } from '../../components/asyncComponent'
const MovieList = asyncComponent(() => import (/* webpackChunkName: "movieList" */ './movieList'))
const MovieCount = asyncComponent(() => import (/* webpackChunkName: "movieCount" */ './movieCount'))

class MoviePage extends React.Component{
    constructor(props){
        super(props);
    }
    render() {
        return (
            <LRLayout
                left={
                    <HashRouterMenu
                        mode="inline"
                        defaultKeys={['movieList']}
                        style={{ height: '100%', borderRight: 0 }}
                        level={2}
                    >
                        <Menu.Item key="movieList"><Link to="/moviePage/movieList" >电影列表</Link></Menu.Item>
                        <Menu.Item key="movieCount"><Link to="/moviePage/movieCount" >统计</Link></Menu.Item>
                    </HashRouterMenu>
                }
                right={
                    <div>
                        <Route path="/moviePage/movieList" component={MovieList}/>
                        <Route path="/moviePage/movieCount" component={MovieCount}/>
                    </div>
                }
            />
        );
    }
}
export default MoviePage;
