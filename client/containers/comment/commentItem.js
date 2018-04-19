/**
 * Created by Aaron on 2018/4/19.
 */
import React from 'react'
import moment from 'moment'
import {Icon} from 'antd'

import './commentItem.scss'

class CommentItem extends React.Component{
    constructor(props){
        super(props);
        let { comment } = this.props;
        this.state = {
            comment: comment
        }
    }

    render(){
        let { comment } = this.state;
        return(
            <div className="comment-item">
                <div className="comment-icon">
                    <img src="/uploads/movie/poster/resize/2-1521781139410.jpg"/>
                </div>
                <div className="comment-detail">
                    <span className="comment-name">
                        <b>{comment.from.name}</b>
                        &emsp;
                        <small>
                            <i>{moment(comment.meta.createAt).format('YYYY-MM-DD HH:mm:ss')}</i>
                        </small>
                    </span>
                    <p className="comment-content">{comment.content}</p>
                    <div className="sub-comment">
                        回复内容列表
                    </div>
                    <a><Icon type="message" />&nbsp;回复</a>
                </div>
            </div>
        );
    }
}

export default CommentItem;