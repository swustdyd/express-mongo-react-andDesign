/**
 * Created by Aaron on 2018/4/18.
 */
import { QueryDefaultOptions } from '../common/commonSetting'

const DefaultPageSize = QueryDefaultOptions.pageSize;

/**
 * 对http请求进行过滤
 * @param req
 * @param res
 * @param next
 */
function filter(req, res, next){
    //初始化url中的分页信息
    if (req.query.pageIndex) {
        req.query.pageIndex = /^[0-9]+$/.test(req.query.pageIndex) ? parseInt(req.query.pageIndex) : 0;
    }else{
        req.query.pageIndex = 0;
    }
    if (req.query.pageSize) {
        req.query.pageSize = /^[1-9][0-9]*$/.test(req.query.pageSize)
            ? Math.min(parseInt(req.query.pageSize), DefaultPageSize) : DefaultPageSize;
    }else{
        req.query.pageSize = DefaultPageSize;
    }
    req.query.offset =  req.query.pageIndex * req.query.pageSize;
    //初始化post请求中的分页信息
    if (req.body.pageIndex) {
        req.body.pageIndex = /^[0-9]+$/.test(req.body.pageIndex) ? parseInt(req.body.pageIndex) : 0;
    }else{
        req.body.pageIndex = 0;
    }
    if (req.body.pageSize) {
        req.body.pageSize = /^[1-9][0-9]*$/.test(req.body.pageSize)
            ? Math.min(parseInt(req.body.pageSize), DefaultPageSize) : DefaultPageSize;
    }else{
        req.body.pageSize = DefaultPageSize;
    }
    req.body.offset =  req.body.pageIndex * req.body.pageSize
    next();
}
export default filter;