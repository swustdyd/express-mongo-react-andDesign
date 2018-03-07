/**
 * Created by Aaron on 2018/3/2.
 */

import React from 'react'
import { Table } from 'antd'

class MovieList extends React.Component{
    constructor(){
        super();
        this.state = {
            movies: []
        }
    }
    componentDidMount(){
        let _this = this;
        fetch('/movie/getMovies')
            .then(res => res.json())
            .then(data => {
                if(data.result && data.result.length > 0){
                    data.result.forEach(function (item) {
                        item.key = item._id;
                    });
                }
                _this.setState({
                    movies: data.result
                })
            });
    }
    render(){
        let columns = [{
            title: '电影名',
            dataIndex: 'title',
            key: 'title',
            render: text => <a href="#">{text}</a>
        },{
            title: '国家',
            dataIndex: 'country',
            key: 'country'
        },{
            title: '语种',
            dataIndex: 'language',
            key: 'language'
        },{
            title: '年代',
            dataIndex: 'year',
            key: 'year'
        },{
            title: '编辑',
            dataIndex: '_id',
            key: 'edit',
            render: id => <a href={`#/movie/detail.html/${id}`}>编辑</a>
        }];
        return(
            <div>
                <Table columns={columns} dataSource={this.state.movies}/>
            </div>
        );
    }
}
export default MovieList;