import React from 'react'
import {message, Icon, Spin} from 'antd'
import API from '../../common/api'
import MoviePoster from '../../components/moviePoster'

import './doubanMovieList.scss'

const AnimationState = {
    preparing: 1,
    start: 2,
    stop: 3
}


export default class DoubanMovieList extends React.Component{
    constructor(props){
        super();
        this.state = {
            lastPageIndex: -1,
            pageIndex: 0,
            pageSize: 12,
            total: 0,
            dataList: [],
            lastClick: false,
            nextClick: false,
            animationStart: false,
            animationDurations: 1000,
            animationState: AnimationState.stop,
            loading: false
        }
    }

    getDoubanMovies(nextPageIndex, pageSize){
        const {dataList, animationDurations, pageIndex: currentPageIndex, loading} = this.state;        
        if(loading){
            return;
        }
        //伪造数据，使要显示的content能初始化
        dataList[nextPageIndex] = [];
        this.setState({
            dataList: dataList,
            lastClick: nextPageIndex < currentPageIndex,
            nextClick: nextPageIndex > currentPageIndex,
            animationState: AnimationState.preparing,                    
            lastPageIndex: currentPageIndex,
            pageIndex: nextPageIndex,
            loading: true
        });
        fetch(`${API.getDoubanMovies}?pageIndex=${nextPageIndex}&pageSize=${pageSize}`)
            .then((res) => {return res.json()})
            .then((data) => {
                if(data.success){
                    //构造成一个二维数组
                    dataList[nextPageIndex] = data.result;
                    //初始化页面，通知开始动画
                    this.setState({
                        dataList: dataList,
                        total: data.total,
                        animationState: AnimationState.start,                        
                        loading: false
                    })
                    //通知动画结束
                    setTimeout(() => {
                        this.setState({
                            animationState: AnimationState.stop
                        })
                    }, animationDurations);
                }else{
                    message.error(data.message);
                }
            })
            .catch((e) => {
                this.setState({                       
                    loading: false
                })
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

    getContentList(dataList = []){
        const {lastPageIndex, pageIndex, pageSize, lastClick, nextClick, animationState} = this.state;
        const contentList = [];
        dataList.forEach((item, index) => {
            let className = '';
            if(pageIndex === index){
                //要显示的content
                if(animationState === AnimationState.preparing){
                    className += lastClick ? ' douban-content-left' : '';
                    className += nextClick ? ' douban-content-right' : '';
                }
            }else if(lastPageIndex === index){
                //当前显示的content 
                if(animationState === AnimationState.start){
                    className += lastClick ? ' douban-content-right' : '';
                    className += nextClick ? ' douban-content-left' : '';
                }else if(animationState === AnimationState.stop){
                    className += ' douban-content-hide';
                }
            }else{
                //不相关的content
                className += ' douban-content-hide';
            }
            contentList.push(
                <div className={`douban-content ${className}`}>
                    {this.getMoviePoster(item)}
                </div>
            )
        });
        return contentList;
    }

    handleNextClick(){
        const {pageIndex, pageSize, loading} = this.state;
        this.getDoubanMovies(pageIndex + 1, pageSize);
    }

    handleLastClick(){
        const {pageIndex, pageSize, loading} = this.state;
        this.getDoubanMovies(pageIndex - 1, pageSize);
    }

    render(){
        const {pageIndex, pageSize, total, dataList, loading} = this.state;
        const hasNext = pageIndex * pageSize + dataList.length < total;
        const hasLast = pageIndex > 0;
        return(
            <Spin tip="加载中..." spinning={loading}>
                <div className="douban-container">
                    {this.getContentList(dataList)}
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
            </Spin>
            
        );
    }
}