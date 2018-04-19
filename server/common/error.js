/**
 * Created by Aaron on 2018/1/5.
 */
//日志打印
let logger = require('./logger');
const express = require('express');
const router = express.Router();

module.exports.errorCode = {
    requestSignin: 1,
    requestAdmin: 2,
    requestSuperAdmin: 3
};

// catch 404 and forward to error handler
router.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
router.use(function(err, req, res, next) {
    // set locals, only providing error in development
    let message = err.message;
    if(res.app.get('env') !== 'dev'){
        message =  '系统错误，请联系管理员';
    }
    /** 将错误信息存储 **/
    logger.error(err);
    res.locals.message = message;
    res.status(err.status || 500);
    res.json({message: message, success: false, errorCode: err.status || 500});
});

module.exports.errorHandle = router;