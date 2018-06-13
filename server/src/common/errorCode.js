/**
 * Created by Aaron on 2018/4/23.
 */
import { ErrorCodeType } from './type';

/**
 * 自定义异常code
 */
const errorCode : ErrorCodeType = {
    defaultCode: 500,
    noAuthroity: 401,
    requestSignin: 1,
    requestAdmin: 2,
    requestSuperAdmin: 3,
    validationError: 4
};
export default errorCode;