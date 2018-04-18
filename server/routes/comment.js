/**
 * Created by Aaron on 2018/1/16.
 */
let express = require('express');
let Comment = require('../models/comment');
let _ = require('underscore');
let Authority = require('../common/authority');
let logger = require('../common/logger');
let CommentService = require('../service/comment');

const router = express.Router();

router.post('/commit', Authority.requestSignin, function (req, res) {
    let comment = req.body.comment;
    let currentUser = req.session.user;
    comment.from = currentUser._id;
    CommentService.saveOrUpdateComment(comment).then(function (resData) {
        res.json({
            message: resData.message,
            success: resData.success,
            result: resData.result
        });
    }).catch(function (err) {
        logger.error(err);
        res.json({
            message: err.message,
            success: false
        });
    });
});

module.exports = router;