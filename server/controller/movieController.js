/*
 * @Author: yedong.deng 
 * @Date: 2018-05-10 17:24:23 
 * @Last Modified by:   aaron.deng 
 * @Last Modified time: 2018-05-10 17:24:23 
 */
import MovieService from '../service/movie'
import PublicFunc from '../common/publicFunc'
import BusinessException from '../common/businessException'
import BaseController from './baseController';
import DoubanMovieServie from '../service/doubanMovieService';

export default class MovieController extends BaseController{
    constructor(){
        super();
        this._movieService = new MovieService();
        this._doubanMovieServie = new DoubanMovieServie();
    }

    /**
     * 获取电影列表
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getMovies(req, res, next) {
        try {            
            const {pageIndex, pageSize} = req.query;
            let condition = req.query.condition || '{}';
            condition = JSON.parse(condition);
            const newCondition = {};

            if(condition.title){
                newCondition.title = new RegExp(`^${condition.title}.*$`, 'i');
            }
            if(condition._id){
                newCondition._id = condition._id;
            }

            if(condition.searchYear && condition.searchYear.start){
                newCondition.year = {};
                newCondition.year.$gte = condition.searchYear.start
            }
            if(condition.searchYear && condition.searchYear.end){
                newCondition.year = newCondition.year || {};
                newCondition.year.$lte = condition.searchYear.end;
            }

            if(condition.language){
                newCondition.language = condition.language;
            }

            const resData = await this._movieService.getMoviesByCondition({
                condition: newCondition,
                pageIndex: pageIndex,
                pageSize: pageSize
            });
            res.json(resData);
        }catch(e) {
            next(e);
        }
    }

    /**
     * 保存或者修改电影
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    async newOrUpdate(request, response, next) {
        try {
            const {movie} = request.body;
            const resData = await this._movieService.saveOrUpdateMovie(movie);
            const message = movie._id ? '修改成功' : '新增成功';
            if(resData.success){
                resData.message = message;
            }
            response.json(resData);
        }catch (e){
            next(e);
        }
    }


    /**
     * 删除电影
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    async delete(request, response, next) {
        try {
            const {id} = request.query;
            const resData = await this._movieService.deleteMovieById(id);
            resData.message = '删除成功';
            response.json(resData);
        }catch (e){
            next(e);
        }
    }

    /**
     * 上传用户头像
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async uploadPoster(req, res, next){
        try {
            const files = await PublicFunc.uploadFiles(req, res, {
                subDir: 'movie/poster/temp',
                fileFilter: ['.png', '.jpg']
            });
            if(files){
                files.forEach((item) => {
                    item.url = PublicFunc.rebuildImgUrl(`uploads/movie/poster/temp/${item.filename}`)
                });
                res.json({success: true, message: '上传成功', result: files});
            }else{
                next(new BusinessException('上传文件为空'));
            }
        }catch (e){
            next(err);
        }
    }

    /**
     * 获取电影的分类信息
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getMoviesByGroup(req, res, next){
        try {
            const groupArray = JSON.parse(req.query.groupArray || '[]');
            const match = JSON.parse(req.query.match || '{}');
            const resData = await this._movieService.getMoviesByGroup(groupArray, match);
            res.json(resData);
        }catch (e){
            next(e);
        }
    }

    /**
     * 获取豆瓣电影信息
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getDoubanMovie(req, res, next){
        try {
            const {pageIndex, pageSize} = req.query;
            res.json(await this._doubanMovieServie.getDoubanMovies(pageIndex, pageSize));
        } catch (error) {
            next(error);
        }
    }

    /**
     * 获取豆瓣电影分组信息
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getGroupInfoOfDouban(req, res, next){
        try {
            const dataList = await Promise.all([
                this._doubanMovieServie.getGroupInfoByYear(),
                this._doubanMovieServie.getGroupInfoByTypes(),
                this._doubanMovieServie.getGroupInfoByLanguages(),
                this._doubanMovieServie.getGroupInfoByCountries()
            ]);
            const result = {
                year: dataList[0],
                types: dataList[1],
                languages: dataList[2],
                countries: dataList[3]
            }
            res.json({success: true, result});
        } catch (error) {
            next(error);
        }
    }
}