/**
 * Created by Aaron on 2018/1/19.
 */
const Comment = require('../models/comment');
const logger = require('../common/logger');
const Promise = require('promise');
const queryDefaultOptions = require('../common/commonSetting').queryDefaultOptions;
const _ = require('underscore');
const BusinessException = require('../common/businessException');

const getCommentById = function (id) {
    return new Promise(function (resolve, reject) {
        if(!id){
            reject(new BusinessException('评论id不能为空'))
        }
        Comment.findOne({_id: id}, )
            .populate([
                {
                    path: 'from',
                    select: 'name'
                },
                {
                    path: 'to',
                    select: 'name'
                }
            ]).exec(function (err, comment) {
                if(err){
                    reject(err)
                }
                resolve({success: true, result: comment});
            })
    });
};

/**
 * 根据条件查询评论
 * @param {Object} options
 * @return {Promise}
 */
const getCommentsByCondition = function (options) {
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
};

/**
 * 根据电影id统计其所有的评论
 * @returns {Promise.<void>}
 */
const countCommentsByMovieId = function(id){
    return new Promise(function (resolve, reject) {
        if (!id) {
            reject(new BusinessException('电影id不能为空'))
        }
        Comment.count({movie: id}, function (err, count) {
            if (err) {
                reject(err);
            }
            resolve({success: true, result: count});
        });
    });
};


/**
 * 根绝电影id获取其下的评论
 * @param {ObjectId} id 电影id
 * @param {Object} customOptions 查询的配置
 * @return {Promise}
 */
const getCommentsByMovieId = async function (id, customOptions) {
    let options = _.extend({}, queryDefaultOptions, customOptions);
    let totalComments = await countCommentsByMovieId(id);
    return new Promise(function (resolve, reject) {
        if(!id){
            reject(new BusinessException('电影id不能为空'))
        }
        Comment.count({movie: id, ...options.condition}, function (err, count) {
            Comment.find({movie: id, ...options.condition})
                .populate([
                    {
                        path: 'from',
                        select: 'name'
                    },
                    {
                        path: 'to',
                        select: 'name'
                    }
                ])
                .sort(options.sort)
                .skip(options.pageIndex * options.pageSize)
                .limit(options.pageSize)
                .exec(function (err, comments) {
                    if(err){
                        reject(err)
                    }
                    resolve({
                        success: true,
                        result: comments,
                        total: count,
                        pageIndex: options.pageIndex,
                        pageSize: options.pageSize,
                        totalComments
                    });
                });
        });
    });
};

const saveOrUpdateComment = async function (comment) {
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
};

module.exports = {
    getCommentById,
    getCommentsByCondition,
    getCommentsByMovieId,
    countCommentsByMovieId,
    saveOrUpdateComment
};
