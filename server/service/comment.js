/**
 * Created by Aaron on 2018/1/19.
 */
var Comment = require('../models/comment');
var logger = require('../common/logger');
var Promise = require('promise');
var queryDefaultOptions = require('../common/commonSetting').queryDefaultOptions;
var _ = require('underscore');

module.exports = {
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
                resolve(comments);
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
            Comment.find({movie: id}, function (err, comments) {
                if(err){
                    reject(err)
                }
                resolve(comments)
            }).sort(options.sort)
                .skip(options.pageSetting.pageIndex * options.pageSetting.pageSize)
                .limit(options.pageSetting.pageSize);
        });
    }
};