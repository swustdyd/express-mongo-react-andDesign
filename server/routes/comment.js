/**
 * Created by Aaron on 2018/1/16.
 */
const express = require('express');
const _ = require('underscore');
const Authority = require('../common/authority');
const logger = require('../common/logger');
const CommentService = require('../service/comment');

const router = express.Router();

router.post('/commit', Authority.requestSignin, async function (req, res, next) {
    try {
        let comment = req.body.comment;
        let currentUser = req.session.user;
        comment.from = currentUser._id;
        let resData = CommentService.saveOrUpdateComment(comment);
        comment = resData.result;
        //再次查询，带出from与to
        resData = await CommentService.getCommentById(comment._id);
        comment = resData.result;

        //查询同一电影，同级的评论条数
        let condition = {
            level: comment.level,
            movie: comment.movie
        };
        if(comment.replayTo){
            condition.replayTo = comment.replayTo;
        }
        resData = await CommentService.getCommentsByCondition({
            condition: condition,
            pageIndex: 0,
            pageSize: 1
        });
        res.json({
            success: true,
            result: comment,
            total: resData.total
        });
    }catch (e){
        next(e);
    }
});

router.get('/getComment/:id', async (req, res, next) => {
    try{
        const movieId = req.params.id,
            pageIndex = req.query.pageIndex,
            pageSize = req.query.pageSize,
            level = req.query.level,
            condition = JSON.parse(req.query.condition || '{}');
        let resData = await CommentService.getCommentsByMovieId(movieId, {
            condition: {
                level: level,
                ...condition
            },
            pageIndex,
            pageSize,
            sort: {
                'meta.createAt': 1
            }
        });
        res.json(resData);
    }catch (e){
        next(e);
    }
});

module.exports = router;