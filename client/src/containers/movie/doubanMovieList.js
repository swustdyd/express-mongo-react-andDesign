import React from 'react'
import {message, Icon} from 'antd'
import API from '../../common/api'
import MoviePoster from '../../components/moviePoster'

import './doubanMovieList.scss'

export default class DoubanMovieList extends React.Component{
    constructor(props){
        super();
        this.state = {
            pageIndex: 0,
            pageSize: 8,
            total: 0,
            dataList: [],
            removeLeft: true,
            removeRight: true
        }
    }

    getDoubanMovies(pageIndex, pageSize){
        fetch(`${API.getDoubanMovies}?pageIndex=${pageIndex}&pageSize=${pageSize}`)
            .then((res) => {return res.json()})
            .then((data) => {
                if(data.success){
                    this.setState({
                        dataList: data.result,
                        pageIndex: data.pageIndex,
                        pageSize: pageSize,
                        total: data.total
                    })
                }else{
                    message.error(data.message);
                }
            })
            .catch((e) => {
                message.error(e.message);
            })
    }

    componentDidMount(){
        const {pageIndex, pageSize} = this.state;
        this.getDoubanMovies(pageIndex, pageSize)
    }

    getMoviePoster(dataList = []){
        const list = [];
        dataList.forEach((item, index) => {            
            list.push(
                <MoviePoster 
                    movieData={{
                        title: item.name,
                        summary: item.summary,
                        poster: {
                            src: item.mainpic.href
                        }
                    }}
                />
            )
        })
        return list;
    }

    handleNextClick(){
        const {pageIndex, pageSize} = this.state;
        this.getDoubanMovies(pageIndex + 1, pageSize);
        this.setState({
            removeRight: false
        })
        setTimeout(() => {
            this.setState({
                removeRight: true  
            })
        }, 600);
    }

    handleLastClick(){
        const {pageIndex, pageSize} = this.state;
        this.getDoubanMovies(pageIndex - 1, pageSize);
        this.setState({
            removeLeft: false
        })
        setTimeout(() => {
            this.setState({
                removeLeft: true  
            })
        }, 600);
    }

    render(){
        const {pageIndex, pageSize, total, dataList, removeLeft, removeRight} = this.state;
        const hasNext = pageIndex * pageSize + dataList.length < total;
        const hasLast = pageIndex > 0; 
        return(
            <div className="douban-container">
                <div className={`douban-content ${removeLeft ? '' : 'douban-content-to-left'} ${removeRight ? '' : 'douban-content-to-right'}`}>
                    {this.getMoviePoster(dataList)}
                </div>
                <div style={{display: 'none'}} className={`${removeLeft ? 'douban-content-to-right' : ''} ${removeRight ? 'douban-content-to-left' : ''}`}></div> 
                {
                    hasLast ?                    
                        <div className="last-icon">
                            <Icon type="left" onClick={() => {this.handleLastClick()}}/>
                        </div>
                        : ''
                }
                {
                    hasNext ?
                        <div className="next-icon">
                            <Icon type="right" onClick={() => {this.handleNextClick()}}/>
                        </div>
                        : ''
                }
            </div>
        );
    }
}