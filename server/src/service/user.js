import UserModel from '../models/user'
import logger from '../common/logger'
import _ from 'underscore'
import PubFunction from '../common/publicFunc'
import BusinessException from '../common/businessException'
import { QueryDefaultOptions } from '../common/commonSetting'
import { PageResult } from '../common/type';
import BaseService from './baseService';
import {db} from '../db'
import Condition from '../db/condition'

/**
 * 用户模块service
 */
export default class UserService extends BaseService{
    /**
     * 根据用户id 获取用户
     * @param userId 用户id
     */
    async getUserById(userId: number) : Promise<UserModel> {
        if(!userId){
            reject(new BusinessException('用户id不能为空'))
        }
        return await UserModel.findOne({
            where:{
                userId: userId
            }
        });            
    }

    /**
     * 根据查询条件查询用户
     * @param condition 查询条件
     */
    async getUsersByCondition(condition: Condition) : Promise<PageResult> {
        condition.setTableName('user');
        const total = await db.count(condition);
        const result = await db.query(condition.toSql(), {type: db.QueryTypes.SELECT});
        return {result, total};
    }

    /**
     * 保存或者更新用户
     * @param user 用户信息
     */
    async saveOrUpdateUser(user: UserModel) : Promise<SingleReturnType> {
        if(user.password){
            //加密用户密码
            const bcryptPassword = await PubFunction.bcryptString(user.password);
            user.password = bcryptPassword;
        }
        if(user.userId){
            //修改用户
            const originUser = await this.getUserById(user.userId);
            originUser.updateAt = Date.now();
            user = _.extend(originUser, user);
            user = await originUser.update(user)
        }else{
            user = await UserModel.create(user);
        }
        return user;
    }


    /**
     * 根据id删除用户
     * @param userId 用户id
     */
    async deleteUserById(userId: number) : Promise<boolean>  {
        if(!userId){
            throw new BusinessException('用户id不能为空');
        }
        const result = await db.query('delete from user where userId = :id', {
            replacements:{
                id: parseInt(userId)
            }
        })
        const {affectedRows} = result[1];
        return affectedRows > 0;
    }
}