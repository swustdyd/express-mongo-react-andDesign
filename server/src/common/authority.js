/**
 * Created by Aaron on 2018/1/15.
 */
import errorCode from './errorCode'
import BusinessException from './businessException'

const role = {
    normal: 0,
    admin: 10,
    superAdmin: 50
};

/**
 * 权限验证
 */
export default class Authroity{
    /**
     * 需要用户登录
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static requestSignin(req, res, next) {
        const {user} = req.session;
        if(!user){
            next(new BusinessException('请登录', errorCode.requestSignin));
        }else{
            next();
        }
    }

    /**
     * 需要普通管理员权限
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static requestAdmin(req, res, next) {
        const {user} = req.session;
        if(!user || user.role < role['admin']){
            next(new BusinessException('需要管理员权限', errorCode.requestAdmin));
        }else{
            next();
        }
    }

    /**
     * 需要超级管理员权限
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static requestSuperAdmin(req, res, next) {
        const {user} = req.session;
        if(!user || user.role < role['superAdmin']){
            next(new BusinessException('需要超级管理员权限', errorCode.requestSuperAdmin));
        }else{
            next();
        }
    }
}