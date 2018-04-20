/**
 * Created by Aaron on 2018/1/16.
 */
let express = require('express');
let _ = require('underscore');
let Authority = require('../common/authority');
let logger = require('../common/logger');
let CommentService = require('../service/comment');

const router = express.Router();

router.post('/commit', Authority.requestSignin, function (req, res) {
    let comment = req.body.comment;
    let currentUser = req.session.user;
    comment.from = currentUser._id;
    CommentService.saveOrUpdateComment(comment).then(async function (resData) {
        let comment = resData.result;
        resData = await CommentService.getCommentById(comment._id);
        comment = resData.result;
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
            message: resData.message,
            success: resData.success,
            result: comment,
            total: resData.total
        });
    }).catch(function (err) {
        logger.error(err);
        res.json({
            message: err.message,
            success: false
        });
    });
});

router.get('/getComment/:id', (req, res) => {
    const movieId = req.params.id,
        pageIndex = req.query.pageIndex,
        pageSize = req.query.pageSize,
        level = req.query.level,
        condition = JSON.parse(req.query.condition || '{}');
    CommentService.getCommentsByMovieId(movieId, {
        condition: {
            level: level,
            ...condition
        },
        pageIndex,
        pageSize,
        sort: {
            'meta.createAt': 1
        }
    }).then(resData => {
        res.json(resData);
    }).catch(err => {
        res.json({success: false, message: err.message});
    })
});

module.exports = router;