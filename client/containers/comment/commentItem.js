/**
 * Created by Aaron on 2018/4/19.
 */
import React from 'react'
import moment from 'moment'
import {Icon, message, Input, Button} from 'antd'

import './commentItem.scss'

const Search = Input.Search;

class CommentItem extends React.Component{
    constructor(props){
        super(props);
        let { comment } = this.props;
        this.state = {
            comment: comment,
            subComments: [],
            replayInput: '',
            replayShow: false
        };
        this.handleReplayInputChange = this.handleReplayInputChange.bind(this);
    }

    componentDidMount(){
        this.getSubComments(0, 10);
    }

    handleReplayBtnClick(){
        this.setState({
            replayShow: !this.state.replayShow
        })
    }

    handleReplayInputChange(e){
        this.setState({
            replayInput: e.target.value
        });
    }

    handleReplayCommitClick(value, replayTo){
        let { comment } = this.state;
        if(value){
            let replayComment = {
                to: replayTo,
                content: value,
                level: 2,
                movie: comment.movie,
                replayTo: comment._id
            };

            fetch('/comment/commit', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                //同域名下，会带上cookie，否则后端根据sessionid获取不到对应的session
                credentials: 'include',
                body: JSON.stringify({
                    comment: replayComment
                })
            }).then(res => res.json())
                .then(data => {
                    if(data.success){
                        message.success('回复成功');
                        this.setState({
                            replayInput: '',
                            replayShow: false
                        });
                        this.getSubComments(0, 10)
                    }else {
                        message.error(data.message);
                    }
                })
        }else {
            message.error('请输入回复内容');
        }
    }

    getSubComments(pageIndex, pageSize){
        let { comment } = this.state;
        let condition = {
            to: comment.from._id,
            replayTo: comment._id
        };
        fetch(`/comment/getComment/${comment.movie}/?pageIndex=${pageIndex || 0}&pageSize=${pageSize || 10}&level=2&condition=${JSON.stringify(condition)}`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    subComments: data.result
                });
            });
    }

    showSubComments(subComments){
        let results = [];
        subComments.forEach((item, index) => {
            results.push(
                <div className="comment-detail" key={index}>
                    <span className="comment-name">
                        <b>{item.from.name}</b>
                        &nbsp;回复&nbsp;
                        <b>{item.to.name}</b>
                        &emsp;
                        <small>
                            <i>{moment(item.meta.createAt).format('YYYY-MM-DD HH:mm:ss')}</i>
                        </small>
                    </span>
                    <p className="comment-content">{item.content}</p>
                </div>
            )
        });
        return results;
    }

    render(){
        let { comment, replayInput, replayShow, subComments} = this.state;
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
                    {
                        subComments.length > 0 ?
                            <div className="sub-comment">
                                {this.showSubComments(subComments)}
                            </div>
                            :
                            ''
                    }

                    <a className="replay-btn" onClick={() => this.handleReplayBtnClick()}><Icon type="message" />&nbsp;回复</a>
                    {
                        replayShow ?
                            <Search
                                className="replay-input"
                                placeholder="输入回复..."
                                onSearch={ value => this.handleReplayCommitClick(value, comment.from)}
                                onChange={this.handleReplayInputChange}
                                enterButton="回复"
                                value={replayInput}
                            />
                            :
                            ''
                    }

                </div>
            </div>
        );
    }
}

export default CommentItem;