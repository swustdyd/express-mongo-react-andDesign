/**
 * Created by Aaron on 2018/1/16.
 */
var express = require('express'),
    router = express.Router();
var Comment = require('../models/comment');
var _ = require('underscore');
var Authority = require('../common/authority');
var logger = require('../common/logger');
var CommentService = require('../service/comment');

router.post('/commit', Authority.requestSignin, function (req, res) {
    var comment = req.body.comment;
    var currentUser = req.session.user;
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