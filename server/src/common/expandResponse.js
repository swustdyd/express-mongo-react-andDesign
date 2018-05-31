import {APIResponseType} from './type'

/**
 * 扩展response的方法，减少代码的书写
 */
function expandResponse(req, res, next){
    res.ok = (resData : APIResponseType) => {
        res.json(Object.assign(resData, {success: true}));
    }

    res.error = (resData : APIResponseType) => {
        res.json(Object.assign(resData, {success: false}));
    }
    next();
}
export default expandResponse;