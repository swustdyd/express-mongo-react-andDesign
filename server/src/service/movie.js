import _ from 'underscore'
import MovieModel from '../models/movie'
import AakModel from '../models/aka'
import AkaWithOtherModel from '../models/akaWithOther'
import LanguageModel from '../models/language'
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
     * 根据id 获取电影详细信息
     * @param movieId 电影id
     */
    async getMovieDetailById(movieId: number) : Promise<MovieModel> {        
        if(!movieId){
            throw new BusinessException('电影id不能为空');
        }
        const sql = `SELECT DISTINCT
                        m. NAME AS title,
                        m.doubanMovieId,
                        m.picture,
                        m. YEAR,
                        m.summary,
                        m.movieId AS _id,
                        (
                            SELECT  GROUP_CONCAT(c.countryName SEPARATOR '&&') from country c
                            LEFT JOIN countrymovie cm on cm.countryId = c.countryId
                            WHERE cm.movieId = m.movieId
                        ) as countrys,
                        (
                            SELECT GROUP_CONCAT(aka.akaName SEPARATOR '&&') from aka
                            LEFT JOIN akawithother ao on ao.akaId = aka.akaId
                            WHERE ao.otherId = m.movieId
                        ) as akas,
                        (
                            SELECT GROUP_CONCAT(p.publishDate SEPARATOR '&&') from publishdate p
                            WHERE p.movieId = m.movieId
                        ) as publishdates,
                        (
                            SELECT GROUP_CONCAT(l.languageName SEPARATOR '&&') from \`language\` l
                            LEFT JOIN languagemovie lm on lm.languageId = l.languageId
                            WHERE lm.movieId = m.movieId
                        ) as languages,
                        (
                            SELECT GROUP_CONCAT(t.typeName SEPARATOR '&&') from type t
                            LEFT JOIN movietype mt on mt.typeId = t.typeId
                            WHERE mt.movieId = m.movieId
                        ) as types,
                        ( SELECT GROUP_CONCAT(result.\`name\` SEPARATOR '&&') 
                                from (
                                    SELECT DISTINCT
                                        a.\`name\` as name, a.artistId, aj.jobId
                                    FROM
                                        artistmovie am
                                    LEFT JOIN artist a ON am.artistId = a.artistId
                                    LEFT JOIN artistjob aj ON aj.artistId = a.artistId
                                    WHERE
                                        am.movieId = 1 and jobId = 1
                                ) result 
                        ) as actors,
                        ( SELECT GROUP_CONCAT(result.\`name\` SEPARATOR '&&') 
                                from (
                                    SELECT DISTINCT
                                        a.\`name\` as name, a.artistId, aj.jobId
                                    FROM
                                        artistmovie am
                                    LEFT JOIN artist a ON am.artistId = a.artistId
                                    LEFT JOIN artistjob aj ON aj.artistId = a.artistId
                                    WHERE
                                        am.movieId = 1 and jobId = 2
                                ) result 
                        ) as writers,
                        ( SELECT GROUP_CONCAT(result.\`name\` SEPARATOR '&&') 
                                from (
                                    SELECT DISTINCT
                                        a.\`name\` as name, a.artistId, aj.jobId
                                    FROM
                                        artistmovie am
                                    LEFT JOIN artist a ON am.artistId = a.artistId
                                    LEFT JOIN artistjob aj ON aj.artistId = a.artistId
                                    WHERE
                                        am.movieId = 1 and jobId = 3
                                ) result 
                        ) as directors
                    FROM
                        movie m
                    where m.movieId = :movieId`;
        return await db.query(sql, {
            type: db.QueryTypes.SELECT,
            replacements: {
                movieId
            }
        })
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
     * 获取电影统计分类信息
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

    /**
     * 获取所有的语言信息
     */
    async getLanguage(){
        return await LanguageModel.findAll();
    }
}