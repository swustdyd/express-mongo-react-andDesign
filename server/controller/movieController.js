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

export default class MovieController extends BaseController{
    constructor(){
        super();
        this.movieService = new MovieService();
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

            const resData = await this.movieService.getMoviesByCondition({
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
            const resData = await this.movieService.saveOrUpdateMovie(movie);
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
            const resData = await this.movieService.deleteMovieById(id);
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
            const resData = await this.movieService.getMoviesByGroup(groupArray, match);
            res.json(resData);
        }catch (e){
            next(e);
        }
    }
}