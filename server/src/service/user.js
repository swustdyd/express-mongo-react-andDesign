/**
 * Created by Aaron on 2018/1/19.
 */
//import User from '../models/user'
const User = {};
import logger from '../common/logger'
import _ from 'underscore'
import PubFunction from '../common/publicFunc'
import BusinessException from '../common/businessException'
import { QueryDefaultOptions } from '../common/commonSetting'
import { ObjectId, SingleReturnType, QueryOptionsType, PageReturnType, UserType } from '../common/type';
import BaseService from './baseService';

const queryDefaultOptions = QueryDefaultOptions;



/**
 * 用户模块service
 */
export default class UserService extends BaseService{
    /**
     * 根据用户id 获取用户
     * @param id 用户id
     */
    getUserById(id: ObjectId) : Promise<SingleReturnType> {
        return new Promise(function (resolve, reject) {
            if(!id){
                reject(new BusinessException('用户id不能为空'))
            }
            User.findOne({_id: id}, function (err, user) {
                if(err){
                    reject(err);
                }
                if(user.icon && user.icon.src){
                    user.icon.src = PubFunction.rebuildImgUrl(user.icon.src);
                }
                resolve({success: true, result: user});
            })
        })
    }

    /**
     * 根据查询条件查询用户
     * @param customOptions 查询条件
     */
    getUsersByCondition(customOptions: QueryOptionsType) : Promise<PageReturnType> {
        const options = _.extend({}, queryDefaultOptions, customOptions);
        return new Promise(function (resolve, reject) {
            User.count(options.condition, function (err, count) {
                User.find(options.condition)
                    .sort(options.sort)
                    .skip(options.pageIndex * options.pageSize)
                    .limit(options.pageSize)
                    .exec((err, users) => {
                        if(err){
                            reject(err);
                        }
                        users.forEach((user) => {
                            if(user.icon && user.icon.src){
                                user.icon.src = PubFunction.rebuildImgUrl(user.icon.src);
                            }
                        });
                        resolve({
                            success: true,
                            result: users,
                            total: count,
                            pageIndex: options.pageIndex,
                            pageSize: options.pageSize
                        });
                    })
            });
        });
    }

    /**
     * 保存或者更新用户
     * @param _user 用户信息
     */
    async saveOrUpdateUser(_user: UserType) : Promise<SingleReturnType> {
        let inputUser = _user;
        if(inputUser.password){
            //加密用户密码
            const bcryptPassword = await PubFunction.bcryptString(inputUser.password);
            inputUser.password = bcryptPassword;
        }
        if(inputUser._id){
            //修改用户
            const resData = await this.getUserById(inputUser._id);
            const originUser = resData.result;
            originUser.meta.updateAt = Date.now();
            inputUser = _.extend(originUser, inputUser);
        }else{
            //新增用户
            inputUser = new User(inputUser);
            inputUser.meta.createAt = inputUser.meta.updateAt = Date.now();
        }

        //保存用户到数据库
        return new Promise(function(resolve, reject){
            if(inputUser.icon && inputUser.icon.src){
                const parseResult = PubFunction.parseUrl(inputUser.icon.src);
                if(parseResult){
                    inputUser.icon.src = parseResult.path;
                }
            }
            inputUser.save(function (err, user) {
                if(err){
                    logger.error('保存用户时发生错误');
                    reject(err);
                }
                resolve({success: true, result: user});
            });
        });
    }


    /**
     * 根据id删除用户
     * @param id 用户id
     */
    deleteUserById(id: ObjectId) : Promise<{success: boolean, message: string}>  {
        return new Promise(function (resolve, reject) {
            if(!id){
                reject(new BusinessException('id不能为空'))
            }
            User.remove({_id: id}, function (err) {
                if(err){
                    reject(err);
                }
                resolve({success: true, message: '删除成功'});
            })
        });
    }
}