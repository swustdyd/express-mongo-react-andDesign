/**
 * Created by Aaron on 2018/1/17.
 */
var Movie = require('../models/movie');
var logger = require('../common/logger');
var Promise = require('promise');
var queryDefaultOptions = require('../common/commonSetting').queryDefaultOptions;
var _ = require('underscore');

module.exports = {
    /**
     * 根据条件查询电影
     * @param {Object} options
     * @return {Promise}
     */
    getMoviesByCondition: function (options) {
        options = _.extend({}, queryDefaultOptions, options);
        return new Promise(function (resolve, reject) {
            Movie.find(options.condition, function (err, movies) {
                if(err){
                    reject(err);
                }
                resolve({success: true, result: movies});
            }).sort(options.sort)
                .skip(options.pageSetting.pageIndex * options.pageSetting.pageSize)
                .limit(options.pageSetting.pageSize);
        });
    },
    /**
     * 根据id 获取电影
     * @param {ObjectId} id
     */
    getMovieById: function (id) {
        return new Promise(function (resolve, reject) {
            if(!id){
                reject(new Error("电影id不能为空"));
            }
            Movie.findOne({_id: id}, function (err, movie) {
                if(err){
                    reject(err);
                }
                resolve({success: true, result: movie});
            })
        });
    },
    deleteMovieById: function (id) {
        return new Promise(function (resolve, reject) {
            if(!id){
                reject(new Error("电影id不能为空"));
            }
            Movie.remove({_id: id}, function (err, movie) {
                if(err){
                    reject(err);
                }
                resolve({success: true});
            });
        });
    },
    saveOrUpdateMovie: function (movie) {
        var service = this;
        return new Promise(function (resolve, reject) {
            //修改
            if(movie._id){
                return service.getMovieById(movie._id).then(function (resData) {
                    var originMovie = resData.result;
                    _.extend(originMovie, movie);
                    originMovie.meta.updateAt = Date.now();
                    resolve(originMovie);
                });
            }else{
                movie = new Movie(movie);
                movie.meta.createAt = movie.meta.updateAt = Date.now();
                resolve(movie);
            }
        }).then(function (movie) {
            return new Promise(function (resolve, reject) {
                movie.save(function (err, movie) {
                    if(err){
                        reject(err);
                    }
                    resolve({success: true, result: movie, message: '保存成功'});
                })
            });
        })
    }
};