/**
 * Created by Aaron on 2018/1/4.
 */
import '../../common/common'
import React from 'react'
import { Route, Link } from 'react-router-dom'
import LRLayout from '../../lrLayout'
import { Layout, Menu } from 'antd'
import MovieList from './movieList'
import MovieEdit from './movieEdit'
import MovieCount from './movieCount'
import Common from '../../common/common'

class MoviePage extends React.Component{
    constructor(props){
        super(props);
        //根据当前路径，初始化二级导航的当前项
        let paths = Common.getHashPath( window.location.href);
        let currentKey = paths[1];
        this.state = {
            currentKey: currentKey
        };
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }
    handleMenuClick(e){
        this.setState({
            currentKey: e.key
        })
    }
    render() {
        return (
            <LRLayout
                left={
                    <Menu
                        mode="inline"
                        onClick={this.handleMenuClick}
                        selectedKeys={[this.state.currentKey]}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        <Menu.Item key="movieList"><Link to="/moviePage/movieList" >电影列表</Link></Menu.Item>
                        <Menu.Item key="movieNew"><Link to="/moviePage/movieNew" >新增电影</Link></Menu.Item>
                        <Menu.Item key="movieCount"><Link to="/moviePage/movieCount" >统计</Link></Menu.Item>
                    </Menu>
                }
                right={
                    <div>
                        <Route path="/moviePage/movieList" component={MovieList}/>
                        <Route path="/moviePage/movieNew" component={MovieEdit}/>
                        <Route path="/moviePage/movieCount" component={MovieCount}/>
                    </div>
                }
            />
        );
    }
}
export default MoviePage;
/*
/!**
 * 删除一项数据
 *!/
$('.del').click(function () {
    let id = $(this).attr('data-id');
    $.ajax({
        url: '/movie/delete',
        data: {'id': id},
        success: function (data) {
            alertTip(data.message);
            if(data.success){
                $('tr.item-id-' + id).remove();
            }
        }
    });
});

/!**
 * 提交电影信息
 *!/
$('#commitMovie').click(function () {
    let movieData = $('#movieForm').jsonSerialize();
    $.ajax({
        url: '/movie/newOrUpdate',
        type: 'post',
        dataType: 'json',
        data: movieData,
        success: function (data) {
            alert(data.message);
            if(data.success){
                location.href = '/movie/list.html'
            }
        }
    });
});*/
