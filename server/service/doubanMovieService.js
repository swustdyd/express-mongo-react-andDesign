import DoubanMovie from '../models/doubanMovie'
import BusinessException from '../common/businessException';
import BaseService from './baseService'
import { rejects } from 'assert';
import { DoubanMovieType } from '../common/type';

export default class DoubanMovieServie extends BaseService{
    /**
     * 保存豆瓣电影信息
     * @param {*} doubanMovie 
     */
    saveDoubanMovie(doubanMovie: DoubanMovieType) : Promise<{success: boolean, result: DoubanMovieType}>{
        return new Promise((resolve, reject) => {
            doubanMovie = new DoubanMovie(doubanMovie);
            doubanMovie.save((err, movie) => {
                if(err){
                    reject(err);
                }
                resolve({success: true, result: movie});
            })
        })
    }
}