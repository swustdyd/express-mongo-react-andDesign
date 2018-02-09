/**
 * Created by Aaron on 2018/1/19.
 */
var Comment = require('../models/comment');
var logger = require('../common/logger');
var Promise = require('promise');
var queryDefaultOptions = require('../common/commonSetting').queryDefaultOptions;
var _ = require('underscore');

module.exports = {
    getCommentById: function (id) {
        return new Promise(function (resolve, reject) {
            if(!id){
                reject(new Error('评论id不能为空'))
            }
            Comment.findOne({_id: id}, function (err, comment) {
                if(err){
                    reject(err)
                }
                resolve({suceess: true, result: comment});
            })
        });
    },
    /**
     * 根据条件查询评论
     * @param {Object} options
     * @return {Promise}
     */
    getCommentsByCondition: function (options) {
        return new Promise(function (resolve, reject) {
            options = _.extend({}, queryDefaultOptions, options);
            Comment.find(options.condition, function (err, comments) {
                if(err){
                    reject(err);
                }
                resolve({success: true, result: comments});
            }).sort(options.sort)
                .skip(options.pageSetting.pageIndex * options.pageSetting.pageSize)
                .limit(options.pageSetting.pageSize);
        });
    },
    /**
     * 根绝电影id获取其下的评论
     * @param {ObjectId} id 电影id
     * @param {Object} options 查询的配置
     * @return {Promise}
     */
    getCommentsByMovieId: function (id, options) {
        return new Promise(function (resolve, reject) {
            if(!id){
                reject(new Error("电影id不能为空"));
            }
            options = _.extend({}, queryDefaultOptions, options);
            Comment.find({movie: id})
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
                .skip(options.pageSetting.pageIndex * options.pageSetting.pageSize)
                .limit(options.pageSetting.pageSize)
                .exec(function (err, comments) {
                    if(err){
                        reject(err)
                    }
                    resolve({
                        success: true,
                        result: comments
                    });
                });
        });
    },
    saveOrUpdateComment: function (comment) {
        var service = this;
        var message;
        return new Promise(function (resolve, reject) {
            if(comment._id){
                message = '修改成功';
                return service.getCommentById(comment._id).then(function (resData) {
                    var originComment = resData.result;
                    _.extend(originComment, comment);
                    comment.meta.updateAt = Date.now();
                    resolve(originComment);
                })
            }else{
                message = '评论成功';
                comment = new Comment(comment);
                comment.meta.createAt = comment.meta.updateAt = Date.now();
                resolve(comment);
            }
        }).then(function (comment) {
            return new Promise(function (resolve, reject) {
                comment.save(function (err, comment) {
                    if(err){
                        reject(err);
                    }
                    resolve({
                        success: true,
                        result: comment,
                        message: message
                    });
                })
            })
        })
    }
};