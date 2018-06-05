/**
 * Created by Aaron on 2018/1/5.
 */
//日志打印
import logger from './logger'
import BusinessException from './businessException'
import {ValidationError} from 'sequelize'
import ErrorCode from './errorCode'

/**
 * 统一自定义异常处理
 */
function errorHandle(err, req, res, next) {
    let message = err.message || err.toString();
    if(err instanceof BusinessException){
        res.json({
            success: false,
            message: message,
            errorCode: err.errorCode
        });
    }else if(err instanceof ValidationError){
        logger.error(err);
        res.json({
            success: false,
            message: err.errors[0].message,
            errorCode: ErrorCode.validationError
        });
    }else if(err instanceof Error){
        if(res.app.get('env') !== 'dev'){
            message =  '系统错误，请联系管理员';
            /** 将错误信息存储 **/
            logger.error(err);
        }else{
            console.log(err);
        }
        res.status(err.status || 500);
        res.json({message: message, success: false, errorCode: err.status || 500});
    }
    res.end();
}
export default errorHandle;