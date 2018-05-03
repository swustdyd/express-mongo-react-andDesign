/**
 * Created by Aaron on 2018/4/19.
 */
import React from 'react'
import moment from 'moment'
import {Icon, message, Input, Spin} from 'antd'
import BaseConfig from '../../../../baseConfig'
import API from '../../common/api'

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
            replayShow: false,
            pageIndex: 0,
            pageSize: 2,
            total: 0,
            loaded: true,
            latestReplayMap: {}
        };
        this.handleReplayInputChange = this.handleReplayInputChange.bind(this);
    }

    componentDidMount(){
        let { pageIndex, pageSize } = this.state;
        this.getSubComments(pageIndex, pageSize);
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

    handleReplayCommitClick(value){
        let { comment, pageIndex, pageSize, subComments, latestReplayMap} = this.state;
        if(value){
            let replayComment = {
                to: comment.from._id,
                content: value,
                level: this.props.level + 1,
                movie: comment.movie,
                replayTo: comment._id
            };

            fetch(API.postComment, {
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
                        subComments.push(data.result);
                        latestReplayMap = latestReplayMap[data.result._id] = data.result;
                        this.setState({
                            replayInput: '',
                            replayShow: false,
                            subComments: subComments,
                            total: data.total,
                            latestReplayMap: latestReplayMap
                        });
                    }else {
                        message.error(data.message);
                    }
                })
        }else {
            message.error('请输入回复内容');
        }
    }

    getSubComments(pageIndex, pageSize){
        let { comment, subComments, latestReplayMap } = this.state;
        let condition = {
            replayTo: comment._id
        };
        fetch(`${API.getComment}/${comment.movie}?pageIndex=${pageIndex || 0}&pageSize=${pageSize || 10}&level=${this.props.level + 1}&condition=${JSON.stringify(condition)}`)
            .then(res => res.json())
            .then(data => {
                data.result.forEach((item, index) => {
                    let obj = latestReplayMap[item._id];
                    if(obj){
                        data.result.splice(index, 1);
                    }
                });

                subComments.push(...data.result);
                this.setState({
                    subComments: subComments,
                    pageIndex: data.pageIndex,
                    pageSize: data.pageSize,
                    total: data.total
                });
            });
    }

    showSubComments(subComments){
        let results = [];
        subComments.forEach((item, index) => {
            results.push(
                <CommentItem
                    key={index}
                    comment={item}
                    level={this.props.level + 1}
                />
            )
        });
        return results;
    }

    getPageControl() {
        let {subComments, total, loaded} = this.state;
        const hasNextPage = total > subComments.length;
        return (
            <Spin tip="评论加载中..." spinning={!loaded}>
                <div className="item-page-control">
                    {
                        loaded ?
                            hasNextPage ?
                                <i>
                                    <a onClick={() => this.getNextPageSubComment()}>
                                        点击加载更多（{total - subComments.length}）条回复
                                    </a>
                                </i>
                                :
                                ''
                            :
                            ''
                    }
                </div>
            </Spin>
        )
    }

    getNextPageSubComment(){
        let { pageIndex, pageSize} = this.state;
        pageIndex++;
        this.getSubComments(pageIndex, pageSize);
    }

    render(){
        let { comment, replayInput, replayShow, subComments} = this.state;
        return(
            <div className="comment-item">
                {
                    this.props.level <= 1 ?
                        <div className="comment-icon">
                            <img src={comment.from.icon && comment.from.icon.src ? comment.from.icon.src : BaseConfig.userDefaultIcon}/>
                        </div>
                        :
                        ''
                }

                <div className="comment-detail">
                    <span className="comment-name">
                        <b>{comment.from.name}</b>
                        {
                            comment.to ?
                                <span>
                                    &nbsp;回复&nbsp;
                                    <b>{comment.to.name}</b>
                                </span>
                                :
                                ''
                        }
                        &emsp;
                        <small>
                            {moment(comment.meta.createAt).format('YYYY-MM-DD HH:mm:ss')}
                        </small>
                    </span>
                    <p className="comment-content">{comment.content}</p>
                    <a className="replay-btn" onClick={() => this.handleReplayBtnClick()}><Icon type="message" />&nbsp;回复</a>
                    {
                        replayShow ?
                            <Search
                                className="replay-input"
                                placeholder="输入回复..."
                                onSearch={ value => this.handleReplayCommitClick(value)}
                                onChange={this.handleReplayInputChange}
                                enterButton="回复"
                                value={replayInput}
                            />
                            :
                            ''
                    }
                    {
                        subComments.length > 0 ?
                            <div className="sub-comment">
                                {this.showSubComments(subComments)}
                                {this.getPageControl()}
                            </div>
                            :
                            ''
                    }
                </div>
            </div>
        );
    }
}

export default CommentItem;