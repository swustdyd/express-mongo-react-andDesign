/**
 * Created by Aaron on 2018/1/16.
 */
var express = require('express'),
    router = express.Router();
var Comment = require('../models/comment');
var _ = require('underscore');
var Authority = require('../common/authority');
var logger = require('../common/logger');

router.post('/commit', Authority.requestSignin, function (req, res) {
    var _comment = req.body.comment;
    var comment = new Comment(_comment);
    var currentUser = req.session.user;
    logger.debug(currentUser._id);
    comment.from = currentUser._id;
    comment.save(function (err, comment) {
        if(err){
            throw err;
        }else{
            res.json({message: '评论成功', success: true, result: comment});
        }
    })
});

module.exports = router;