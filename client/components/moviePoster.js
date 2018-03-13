/**
 * Created by Aaron on 2018/2/28.
 */
import React from 'react'
import { Col, Card, Spin } from 'antd'

import './moviePoster.scss'

const { Meta } = Card;

class MoviePoster extends React.Component{
    constructor(){
        super();
        this.state= {
            loaded: false
        }
    }
    render(){
        return(
            <Col xs={12} md={6} lg={6} xl={4} className="poster">
                <Spin tip="图片加载中..." spinning={!this.state.loaded}>
                    <Card
                        hoverable
                        cover={
                            <a href={this.props.href}>
                                    <img title={this.props.name} src={this.props.poster} onLoad={()=>{
                                        this.setState({
                                            loaded: true
                                        })
                                    }}/>
                            </a>
                        }
                    >
                        <Meta
                            title={this.props.name}
                        />
                    </Card>
                </Spin>
            </Col>
        );
    }
}
export default MoviePoster;