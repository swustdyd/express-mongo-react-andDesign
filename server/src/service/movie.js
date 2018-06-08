import _ from 'underscore'
import MovieModel from '../models/movie'
import AakModel from '../models/aka'
import AkaWithOtherModel from '../models/akaWithOther'
import { db } from '../db';
import PubFunction from '../common/publicFunc'
import BusinessException from '../common/businessException'
import { QueryDefaultOptions } from '../common/commonSetting'
import { PageReturnType, QueryOptionsType, ObjectId, SingleReturnType, MovieType } from '../common/type';
import BaseService from './baseService';

/**
 * 电影模块service
 */
export default class MovieService extends BaseService{
    /**
     * 根据条件查询电影
     * @param customOptions 查询条件
     */
    async getMoviesByCondition(customOptions: QueryOptionsType) : Promise<PageReturnType> {
        const options = _.extend({}, QueryDefaultOptions, customOptions);
        return await MovieModel.findAll({
            inlcude:[{
                model: AkaWithOtherModel,
                as: 'awo',
                where: {
                    movieId: db.Sequelize.col('awo.otherId')
                },
                inlcude:[{
                    model: AakModel,
                    as: 'a',
                    where: {
                        akaId: db.Sequelize.col('a.akaId')
                    }
                }]
            }],
            offset: options.pageIndex * options.pageSize,
            limit: options.pageSize
        });
    }

    /**
     * 根据id 获取电影
     * @param movieId 电影id
     */
    async getMovieById(movieId: number) : Promise<MovieModel> {        
        if(!movieId){
            throw new BusinessException('电影id不能为空');
        }
        return await MovieModel.findOne({
            where:{
                movieId: movieId
            }
        });
    }

    /**
     * 根据电影id删除电影
     * @param movieId 电影id
     */
    async deleteMovieById(movieId: number) : Promise<boolean> {
        if(!movieId){
            throw new BusinessException('电影id不能为空');
        }
        const result = await db.query('delete from movie where movieId = :id', {
            replacements:{
                id: parseInt(movieId)
            }
        })
        const {affectedRows} = result[1];
        return affectedRows > 0;
    }

    /**
     * 保存或者修改电影
     * @param movie 电影信息
     */
    async saveOrUpdateMovie(movie: MovieModel) : Promise<MovieModel> {
        //修改
        if(movie.movieId){
            movie.updateAt = Date.now();
            const originModel = await this.getMovieById(movie.movieId);
            if(!originModel){
                throw new BusinessException(`电影'${movie.movieId}'不存在`);
            }
            movie = await originModel.update(movie);
        }else{
            movie = await MovieModel.create(movie)
        }
        return movie;
    }    
}