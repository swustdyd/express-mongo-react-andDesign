/**
 * Created by Aaron on 2018/2/28.
 */
import React from 'react'
import { Col, Card, Spin } from 'antd'

import './moviePoster.scss'

const { Meta } = Card;

/**
 * MoviePoster组件，显示为卡片样式，可翻转
 * props.movieData = {
 *     title: string,
 *     poster: {
 *         src: string
 *     },
 *     summary: string  
 * }
 */
class MoviePoster extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            loaded: false,
            frontStatus: true
        }
    }
    handleClick(id){
        let result = true;
        if(this.props.handlePosterClick){
            result = this.props.handlePosterClick(id);
        }
        if(result){
            this.setState({
                frontStatus: !this.state.frontStatus
            })
        }
    }
    render(){
        const { movieData } = this.props;
        const { frontStatus } = this.state;
        let classNameOfFront = '', classNameOfBack = '';
        if( frontStatus){
            classNameOfFront = 'show';
            classNameOfBack = 'hide';
        }else{
            classNameOfFront = 'hide';
            classNameOfBack = 'show'
        }
        return(
            <Col style={this.props.style || {}}
                xs={12} md={6} lg={6} xl={4}
                className={`poster ${this.props.className}`}
                onClick={this.handleClick.bind(this, movieData._id)}
            >
                <Spin tip="图片加载中..." spinning={!this.state.loaded}>
                    <Card className={`front ${classNameOfFront}`}
                        hoverable
                        cover={
                            <a>
                                <img 
                                    title={movieData.title} 
                                    src={movieData.poster.src} 
                                    onLoad={() => {
                                        this.setState({loaded: true})
                                    }}
                                />
                            </a>
                        }
                    >
                        <Meta
                            title={movieData.title}
                        />
                    </Card>
                    <div className={`back ${classNameOfBack}`}>
                        <h3>简介</h3>
                        <p>{movieData.summary}</p>
                    </div>
                </Spin>
            </Col>
        );
    }
}
export default MoviePoster;