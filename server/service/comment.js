/**
 * Created by Aaron on 2018/1/19.
 */
import Comment from '../models/comment'
import _ from 'underscore'
import PubFunction from '../common/publicFunc'
import BusinessException from '../common/businessException'
import { QueryDefaultOptions } from '../common/commonSetting'
import logger from '../common/logger'
import { SingleReturnType, PageReturnType } from '../common/type';

const queryDefaultOptions = QueryDefaultOptions;

/**
 * 根据id获取评论
 * @param id ObjectId-评论id
 * @returns {Promise.<SingleReturnType>}
 */
function getCommentById(id: string) {
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
 * @param options object-查询的条件
 * @return {Promise.<PageReturnType>}
 */
function getCommentsByCondition(options: object) {
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
 * @param id ObjectId-电影id
 * @returns {Promise.<{success: boolean, count: number}>}
 */
function countCommentsByMovieId(id: string){
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
 * @param id ObjectId-电影id
 * @param customOptions object-查询的配置
 * @return {Promise.<PageReturnType>}
 */
const getCommentsByMovieId = async function (id: string, customOptions: object) {
    let options = _.extend({}, queryDefaultOptions, customOptions);
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
                    let fromHasChanged = {};
                    comments.forEach(comment => {
                        //关联查询返回的from是个对象，已经修改过from的src，不再修改，避免重复修改
                        if(fromHasChanged[comment.from._id]){
                            return false;
                        }else {
                            fromHasChanged[comment.from._id] = 1;
                            let srcExist = comment.from && comment.from.icon && comment.from.icon.src;
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
};

/**
 * 保存或者更新评论
 * @param {*} comment Comment-评论的详细信息
 * @returns {Promise.<SingleReturnType>}
 */
async function saveOrUpdateComment(comment: object) {
    let originComment = '';
    if(comment._id){
        let resData = await getCommentById(comment._id);
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

/**
 * 评论模块service
 */
const commentService = {
    getCommentById,
    getCommentsByCondition,
    getCommentsByMovieId,
    countCommentsByMovieId,
    saveOrUpdateComment
};

export default commentService;
