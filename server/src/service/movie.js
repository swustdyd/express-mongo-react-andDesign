import _ from 'underscore'
import MovieModel from '../models/movie'
import AakModel from '../models/aka'
import AkaWithOtherModel from '../models/akaWithOther'
import { db } from '../db';
import PubFunction from '../common/publicFunc'
import BusinessException from '../common/businessException'
import { QueryDefaultOptions } from '../common/commonSetting'
import { PageResult } from '../common/type';
import BaseService from './baseService';
import Condition from '../db/condition';

/**
 * 电影模块service
 */
export default class MovieService extends BaseService{
    /**
     * 根据条件查询电影
     * @param condition 查询条件
     */
    async getMoviesByCondition(condition: Condition) : Promise<PageResult> {
        condition.setTableName('movie');
        const total = await db.count(condition);
        const result = await db.query(condition.toSql(), {
            type: db.QueryTypes.SELECT
        });
        return {total, result}
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
    /**
     * 获取电影分类信息
     * @param {*} key 分组的字段
     * @param {*} whereArray 筛选条件
     */
    async getMoviesByGroup(key: string = '', whereArray: [{key: string, value: any}]) : Promise<[{count: number, group: string}]>{
        const groups = {
            year: {
                groupKey: 'year',
                select: 'year'
            },
            language: {
                groupKey: 'l.languageId',
                select: 'l.languageName'
            },
            country: {
                groupKey: 'c.countryId',
                select: 'c.countryName'
            }
        }
        const group = groups[key]
        if(!group){
            throw new BusinessException(`不支持字段${key}的分组`);
        }
        const whereStr = whereArray.map((item) => {
            return `${item.key} = :${item.key}`
        }).join(', ');
        const whereReplacements = whereArray.map((item) => {
            return {
                [item.key]: item.value
            }
        }).join(', ');
        const sql = `select count(movie.movieId) as count, ${group.select} as \`${key}\`  from movie 
            left join languagemovie AS lm ON lm.movieId = movie.movieId
            left join LANGUAGE AS l ON l.languageId = lm.languageId
            left join countrymovie AS cm ON cm.movieId = movie.movieId
            left join country AS c ON c.countryId = cm.countryId
            ${whereStr ? `where ${whereStr}` : ''}
            group by ${group.groupKey}`;
        return await db.query(sql, {
            type: db.QueryTypes.SELECT,
            replacements: whereReplacements
        });
    }
}