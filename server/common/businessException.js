/**
 * Created by Aaron on 2018/4/23.
 */

import ErrorCode from './errorCode'
import { ErrorCodeType } from './type';

/**
 * 自定义业务异常
 */
export default class BusinessException {
    /**
     * 自定义业务异常构造函数
     * @param {*} message 
     * @param {*} errorCode 
     * @param {*} extra 
     */
    constructor(message: string, errorCode?: ErrorCodeType = ErrorCode.defaultCode, extra?: any){
        this.message = message;
        this.errorCode = errorCode;
        /**
         * 额外的异常信息
         */
        this.extra = extra;
    }    
}