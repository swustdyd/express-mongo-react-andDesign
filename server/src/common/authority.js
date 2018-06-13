import jwt from 'jsonwebtoken'
import errorCode from './errorCode'
import BusinessException from './businessException'
import {tokenSecret} from '../../../baseConfig'

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
        const token = req.get('Authorization');
        if(!token){
            next(new BusinessException('无权访问', errorCode.noAuthroity));
        }else{
            jwt.verify(token, tokenSecret, (err, decoded) => {
                if(err){
                    next(new BusinessException(Authroity._handleJWTError(err), errorCode.requestSignin));
                }else{
                    const {user} = decoded;   
                    if(!user){
                        next(new BusinessException('请登录', errorCode.requestSignin));
                    }else{                    
                        next();
                    }
                }
            }); 
        }      
               
    }

    /**
     * 需要普通管理员权限
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static requestAdmin(req, res, next) {        
        const token = req.get('Authorization');
        if(!token){
            next(new BusinessException('无权访问', errorCode.noAuthroity));
        }else{
            const decoded = jwt.verify(token, tokenSecret, (err, decoded) => {
                if(err){
                    next(new BusinessException(Authroity._handleJWTError(err), errorCode.requestSignin));
                }else{
                    const {user} = decoded;   
                    if(!user || user.role < role['admin']){
                        next(new BusinessException('需要管理员权限', errorCode.requestSuperAdmin));
                    }else{
                        next();
                    }    
                }
            }); 
        }   
    }

    /**
     * 需要超级管理员权限
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static requestSuperAdmin(req, res, next) {
        const token = req.get('Authorization');
        if(!token){
            next(new BusinessException('无权访问', errorCode.noAuthroity));
        }
        jwt.verify(token, tokenSecret, (err, decoded) => {
            if(err){
                next(new BusinessException(Authroity._handleJWTError(err), errorCode.requestSignin));
            }else{
                const {user} = decoded;   
                if(!user || user.role < role['superAdmin']){
                    next(new BusinessException('需要超级管理员权限', errorCode.requestSuperAdmin));
                }else{
                    next();
                } 
            }   
        });   
    }

    static _handleJWTError(err){
        console.log(err);
        const message = 'token不合法';
        return message;
    }
}