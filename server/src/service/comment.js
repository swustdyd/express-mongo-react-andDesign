/**
 * Created by Aaron on 2018/1/19.
 */
//import Comment from '../models/comment'
const Comment = {};
import _ from 'underscore'
import PubFunction from '../common/publicFunc'
import BusinessException from '../common/businessException'
import { QueryDefaultOptions } from '../common/commonSetting'
import logger from '../common/logger'
import { SingleReturnType, PageReturnType, ObjectId, QueryOptionsType, CommentType } from '../common/type';
import BaseService from './baseService';

const queryDefaultOptions = QueryDefaultOptions;

/**
 * 评论模块service
 */
export default class CommentService extends BaseService{
    /**
     * 根据id获取评论
     * @param id 评论id
     */
    getCommentById(id: ObjectId) : Promise<SingleReturnType> {
        return new Promise(function (resolve, reject) {
            if(!id){
                reject(new BusinessException('评论id不能为空'))
            }
            Comment.findOne({_id: id})
                .populate([
                    {
                        path: 'from',
                        select: 'name icon'
                    },
                    {
                        path: 'to',
                        select: 'name icon'
                    }
                ]).exec(function (err, comment) {
                    if(err){
                        reject(err)
                    }
                    if(comment.from && comment.from.icon && comment.from.icon.src){
                        comment.from.icon.src = PubFunction.rebuildImgUrl(comment.from.icon.src);
                    }
                    resolve({success: true, result: comment});
                })
        });
    }


    /**
     * 根据条件查询评论
     * @param options 查询的条件
     */
    getCommentsByCondition(options: QueryOptionsType) : Promise<PageReturnType> {
        return new Promise(function (resolve, reject) {
            options = _.extend({}, queryDefaultOptions, options);
            Comment.count(options.condition, function (err, count) {
                if(err){
                    reject(err);
                }
                Comment.find(options.condition)
                    .sort(options.sort)
                    .skip(options.pageIndex * options.pageSize)
                    .limit(options.pageSize)
                    .exec((err, comments) => {
                        if(err){
                            reject(err);
                        }
                        resolve({
                            success: true,
                            result: comments,
                            total: count,
                            pageIndex: options.pageIndex,
                            pageSize: options.pageSize
                        });
                    });
            });
        });
    }

    /**
     * 根据电影id统计其所有的评论
     * @param id 电影id
     */
    countCommentsByMovieId(id: ObjectId) : Promise<{success: boolean, count: number}>{
        return new Promise(function (resolve, reject) {
            if (!id) {
                reject(new BusinessException('电影id不能为空'))
            }
            Comment.count({movie: id}, function (err, count) {
                if (err) {
                    reject(err);
                }
                resolve({success: true, count: count});
            });
        });
    }


    /**
     * 根绝电影id获取其下的评论
     * @param id 电影id
     * @param customOptions 查询的配置
     */
    getCommentsByMovieId(id: ObjectId, customOptions: QueryOptionsType) : Promise<PageReturnType> {
        const options = _.extend({}, queryDefaultOptions, customOptions);
        return new Promise(function (resolve, reject) {
            if(!id){
                reject(new BusinessException('电影id不能为空'))
            }
            Comment.count({movie: id, ...options.condition}, function (err, count) {
                Comment.find({movie: id, ...options.condition})
                    .populate([
                        {
                            path: 'from',
                            select: 'name icon'
                        },
                        {
                            path: 'to',
                            select: 'name icon'
                        }
                    ])
                    .sort(options.sort)
                    .skip(options.pageIndex * options.pageSize)
                    .limit(options.pageSize)
                    .exec(function (err, comments) {
                        if(err){
                            reject(err)
                        }
                        const fromHasChanged = {};
                        comments.forEach((comment) => {
                            //关联查询返回的from是个对象，已经修改过from的src，不再修改，避免重复修改
                            if(fromHasChanged[comment.from._id]){
                                return false;
                            }else {
                                fromHasChanged[comment.from._id] = 1;
                                const srcExist = comment.from && comment.from.icon && comment.from.icon.src;
                                if(srcExist){
                                    comment.from.icon.src = PubFunction.rebuildImgUrl(comment.from.icon.src);
                                }
                            }
                        });
                        resolve({
                            success: true,
                            result: comments,
                            total: count,
                            pageIndex: options.pageIndex,
                            pageSize: options.pageSize
                        });
                    });
            });
        });
    }

    /**
     * 保存或者更新评论
     * @param comment 评论的详细信息
     */
    async saveOrUpdateComment(comment: CommentType) : Promise<SingleReturnType> {
        let originComment = '';
        if(comment._id){
            const resData = await this.getCommentById(comment._id);
            originComment = resData.result;
            _.extend(originComment, comment);
            comment.meta.updateAt = Date.now();
        }else{
            originComment = new Comment(comment);
            originComment.meta.createAt = originComment.meta.updateAt = Date.now();
        }
        return new Promise(function (resolve, reject) {
            originComment.save(function (err, comment) {
                if(err){
                    reject(err);
                }
                resolve({
                    success: true,
                    result: comment
                });
            })
        });
    }
}

