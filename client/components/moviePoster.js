/**
 * Created by Aaron on 2018/2/28.
 */
import React from 'react'
import { Col, Card } from 'antd'

const { Meta } = Card;

class MoviePoster extends React.Component{
    render(){
        return(
            <Col span={3} className="poster">
                <Card
                    hoverable
                    cover={
                        <a href={this.props.href}>
                            <img alt={this.props.name} src={this.props.poster}/>
                        </a>
                    }
                >
                    <Meta
                        title={this.props.name}
                    />
                </Card>
            </Col>
        );
    }
}
export default MoviePoster;