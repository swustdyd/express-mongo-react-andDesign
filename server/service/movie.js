/**
 * Created by Aaron on 2018/1/17.
 */
import Movie from '../models/movie'
import Promise from 'promise'
import _ from 'underscore'
import BusinessException from '../common/businessException'
import { QueryDefaultOptions } from '../common/commonSetting'

const queryDefaultOptions = QueryDefaultOptions;

/**
 * 根据条件查询电影
 * @param {Object} customOptions
 * @return {Promise}
 */
const getMoviesByCondition = function (customOptions) {
    let options = _.extend({}, queryDefaultOptions, customOptions);
    return new Promise(function (resolve, reject) {
        Movie.count(options.condition, function (err, count) {
            if(err){
                reject(err);
            }
            Movie.find(options.condition)
                .sort(options.sort)
                .limit(options.pageSize)
                .skip(options.pageIndex * options.pageSize)
                .exec((err, movies) => {
                    if(err){
                        reject(err);
                    }
                    resolve({
                        success: true,
                        result: movies,
                        total: count,
                        pageIndex: options.pageIndex,
                        pageSize: options.pageSize
                    });
                });
        });
    });
};

/**
 * 根据id 获取电影
 * @param {ObjectId} id
 */
const getMovieById = function (id) {
    return new Promise(function (resolve, reject) {
        if(!id){
            reject(new BusinessException('电影id不能为空'))
        }
        Movie.findOne({_id: id}, function (err, movie) {
            if(err){
                reject(err);
            }
            resolve({success: true, result: movie});
        })
    });
};

const deleteMovieById = function (id) {
    return new Promise(function (resolve, reject) {
        if(!id){
            reject(new BusinessException('电影id不能为空'))
        }
        Movie.remove({_id: id}, function (err) {
            if(err){
                reject(err);
            }
            resolve({success: true});
        });
    });
};

const saveOrUpdateMovie = async function (movie) {
    let originMovie = '';
    //修改
    if(movie._id){
        let resData = await getMovieById(movie._id);
        originMovie = resData.result;
        _.extend(originMovie, movie);
        originMovie.meta.updateAt = Date.now();
    }else{
        originMovie = new Movie(movie);
        originMovie.meta.createAt = originMovie.meta.updateAt = Date.now();
    }
    return new Promise(function (resolve, reject) {
        originMovie.save(function (err, movie) {
            if(err){
                reject(err);
            }
            resolve({success: true, result: movie});
        })
    });
};

const getMoviesByGroup = (groupArray, match) => {
    return new Promise((resolve, reject) => {
        let group = {};
        groupArray = groupArray || [];
        groupArray.forEach(item => {
            group[item] = `$${item}`
        });
        match = match || {};
        Movie.aggregate([
            {$match: match},
            {$group: {_id: group, count: { $sum: 1}}}
        ], (err, data) => {
            if(err){
                reject(err);
            }
            resolve({success: true, result: data});
        })
    });
};

export default {
    getMoviesByGroup,
    getMovieById,
    getMoviesByCondition,
    saveOrUpdateMovie,
    deleteMovieById
};