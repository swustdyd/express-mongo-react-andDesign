/**
 * Created by Aaron on 2018/2/28.
 */
import React from 'react'
import Col from 'antd/lib/col'

class MoviePoster extends React.Component{
    render(){
        return(
            <Col span={3} className="poster">
                <a href={this.props.href}>
                    <img src={this.props.poster} alt={this.props.name} className="poster-img"/>
                </a>
                <div className="poster-name">
                    <span>{this.props.name}</span>
                </div>
            </Col>
        );
    }
}
export default MoviePoster;