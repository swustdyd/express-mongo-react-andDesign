/**
 * Created by Aaron on 2018/1/5.
 */
//日志打印
const logger = require('./logger');
const BusinessException = require('./businessException');

// error handler
function errorHandle(err, req, res, next) {
    // set locals, only providing error in development
    if(err instanceof BusinessException){
        res.json({
            success: false,
            message: err.message,
            errorCode: err.errorCode
        });
    }else {
        let message = err.message || err.toString();
        if(res.app.get('env') !== 'dev'){
            message =  '系统错误，请联系管理员';
        }
        /** 将错误信息存储 **/
        logger.error(err);
        res.locals.message = message;
        res.status(err.status || 500);
        res.json({message: message, success: false, errorCode: err.status || 500});
    }
    res.end();
}

module.exports = errorHandle;