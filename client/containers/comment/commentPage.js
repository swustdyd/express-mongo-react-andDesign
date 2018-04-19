/**
 * Created by Aaron on 2018/1/17.
 */
import React from 'react'
import { Spin, Input, Button, message} from 'antd'
import Common from '../../common/common'
import CommentItem from './commentItem'

import './commentPage.scss'

const { TextArea } = Input;

class CommentPage extends  React.Component{
    constructor(props){
        super(props);
        const movieId = Common.getCurrentMenuKey({level: 3});
        this.state = {
            movie: {
                _id: movieId
            },
            loaded: true,
            comments: [],
            inputComment: '',
            pageIndex: 0,
            pageSize: 10,
            total:0,
            totalComments: 0
        };
        this.handlerCommentInputChange = this.handlerCommentInputChange.bind(this);
        this.handleCommentCommitClick = this.handleCommentCommitClick.bind(this)
    }

    componentDidMount(){
        let { movie } = this.state;
        fetch(`/movie/getMovies?condition=${JSON.stringify({_id: movie._id})}`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    movie: data.result[0]
                });
                this.getComments(0, 10);
            });
    }

    getComments(pageIndex, pageSize){
        let { movie } = this.state;
        fetch(`/comment/getComment/${movie._id}/?pageIndex=${pageIndex || 0}&pageSize=${pageSize || 10}&level=1`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    loaded: true,
                    comments: data.result,
                    pageIndex: data.pageIndex,
                    pageSize: data.pageSize,
                    total: data.total,
                    totalComments: data.totalComments
                });
            });
        this.setState({
            loaded: false
        });
    }

    showMovieDetail(movie){
        let results = [];
        results.push(
            <div key="title" style={{ wordBreak: 'break-all'}}>
                <b>名称:</b> {movie.title}
            </div>,
            <div key='country' style={{ wordBreak: 'break-all'}}>
                <b>国家:</b> {movie.country}
            </div>,
            <div key='language' style={{ wordBreak: 'break-all'}}>
                <b>语言:</b> {movie.language}
            </div>,
            <div key='summary' style={{ wordBreak: 'break-all'}}>
                <b>简介:</b> {movie.summary}
            </div>
        )
        return results;
    }

    handlerCommentInputChange(e){
        this.setState({
            inputComment: e.target.value
        })
    }

    handleCommentCommitClick(){
        let { inputComment, movie, pageIndex, pageSize} = this.state;
        if(inputComment){
            let comment = {
                movie: movie._id,
                content: inputComment,
                level: 1
            };
            fetch('/comment/commit', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                //同域名下，会带上cookie，否则后端根据sessionid获取不到对应的session
                credentials: 'include',
                body: JSON.stringify({
                    comment: comment
                })
            }).then(res => res.json())
                .then(data => {
                    if(data.success){
                        message.success('评论成功');
                        this.getComments(pageIndex, pageSize);
                        this.setState({
                            inputComment: ''
                        });
                    }else {
                        message.error(data.message);
                    }

                })
        }else{
            message.error('请输入评论');
        }
    }

    showComments(comments){
        let results = [];
        comments.forEach((item, index) => {
            results.push(<CommentItem key={index} comment={item}/>);
        });
        return results;
    }

    render(){
        const { movie, comments, pageIndex, pageSize, total, inputComment, totalComments} = this.state;
        return(
            <div>
                { this.showMovieDetail(movie) }
                <div className="comment-area">
                    <TextArea
                        placeholder="输入评论..."
                        autosize={{ minRows: 2, maxRows: 6 }}
                        onChange={this.handlerCommentInputChange}
                        value={inputComment}
                    />
                    <Button onClick={this.handleCommentCommitClick} type='primary'>评论</Button>
                </div>
                <Spin tip="评论加载中..." spinning={!this.state.loaded}>
                    已有评论（{totalComments}）条
                    <div className="comment-list">
                        {this.showComments(comments)}
                    </div>
                </Spin>
            </div>
        );
    }
}

export default CommentPage;
