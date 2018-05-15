/**
 * Created by Aaron on 2018/1/4.
 */
import '../../common/common'
import React from 'react'
import { Route, Link } from 'react-router-dom'
import LRLayout from '../../common/lrLayout'
import HashRouterMenu from '../../components/hashRouterMenu'
import {Menu } from 'antd'
import { asyncComponent } from '../../components/asyncComponent'
/* webpackChunkName: "movieList" */ 
const MovieList = asyncComponent(() => {
    return import ('./movieList')
})
/* webpackChunkName: "movieCount" */ 
const MovieCount = asyncComponent(() => {
    return import ('./movieCount')
})
/* webpackChunkName: "commentPage" */ 
const CommentPage = asyncComponent(() => {
    return import ('../comment/commentPage')
})
/* webpackChunkName: "commentPage" */ 
const DoubanMovieList = asyncComponent(() => {
    return import ('./doubanMovieList')
})

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
                        <Menu.Item key="doubanMovieList"><Link to="/moviePage/doubanMovieList" >豆瓣电影列表</Link></Menu.Item>
                    </HashRouterMenu>
                }
                right={
                    <div>
                        <Route path="/moviePage/movieList" component={MovieList}/>
                        <Route path="/moviePage/movieCount" component={MovieCount}/>
                        <Route path="/moviePage/comment/:movieId" component={CommentPage}/>
                        <Route path="/moviePage/doubanMovieList" component={DoubanMovieList}/>
                    </div>
                }
            />
        );
    }
}
export default MoviePage;
