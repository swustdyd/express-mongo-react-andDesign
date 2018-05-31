/**
 * Created by Aaron on 2018/1/17.
 */
import Movie from '../models/movie'
import _ from 'underscore'
import PubFunction from '../common/publicFunc'
import BusinessException from '../common/businessException'
import { QueryDefaultOptions } from '../common/commonSetting'
import { PageReturnType, QueryOptionsType, ObjectId, SingleReturnType, MovieType } from '../common/type';
import BaseService from './baseService';

const queryDefaultOptions = QueryDefaultOptions;

/**
 * 电影模块service
 */
export default class MovieService extends BaseService{
    /**
     * 根据条件查询电影
     * @param customOptions 查询条件
     */
    getMoviesByCondition(customOptions: QueryOptionsType) : Promise<PageReturnType> {
        const options = _.extend({}, queryDefaultOptions, customOptions);
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
                        movies.forEach((movie) => {
                            if(movie.poster && movie.poster.src){
                                movie.poster.src = PubFunction.rebuildImgUrl(movie.poster.src);
                            }
                        });
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
    }

    /**
     * 根据id 获取电影
     * @param id 电影id
     */
    getMovieById(id: ObjectId) : Promise<SingleReturnType> {
        return new Promise(function (resolve, reject){
            if(!id){
                reject(new BusinessException('电影id不能为空'))
            }
            Movie.findOne({_id: id}, function (err, movie) {
                if(err){
                    reject(err);
                }
                if(movie.poster && movie.poster.src){
                    movie.poster.src = PubFunction.rebuildImgUrl(movie.poster.src);
                }
                resolve({success: true, result: movie});
            })
        });
    }

    /**
     * 根据电影id删除电影
     * @param id 电影id
     */
    deleteMovieById(id: ObjectId) : Promise<{success: boolean}> {
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
    }

    /**
     * 保存或者修改电影
     * @param movie 电影信息
     */
    async saveOrUpdateMovie(movie: MovieType) : Promise<SingleReturnType> {
        let originMovie = '';
        //修改
        if(movie._id){
            const resData = await this.getMovieById(movie._id);
            originMovie = resData.result;
            _.extend(originMovie, movie);
            originMovie.meta.updateAt = Date.now();
        }else{
            originMovie = new Movie(movie);
            originMovie.meta.createAt = originMovie.meta.updateAt = Date.now();
        }
        return new Promise(function (resolve, reject) {
            if(originMovie.poster && originMovie.poster.src){
                const parseResult = PubFunction.parseUrl(originMovie.poster.src);
                if(parseResult){
                    originMovie.poster.src = parseResult.path;
                }
            }
            originMovie.save(function (err, movie) {
                if(err){
                    reject(err);
                }
                resolve({success: true, result: movie});
            })
        });
    }

    /**
     * 根据分组信息返回对应的数据
     * @param groupArray
     * @param match 
     */
    getMoviesByGroup(groupArray: [], match: {}) : Promise<SingleReturnType> {
        return new Promise((resolve, reject) => {
            const group = {};
            groupArray = groupArray || [];
            groupArray.forEach((item) => {
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
    }
}