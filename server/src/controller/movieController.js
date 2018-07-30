import MovieService from '../service/movie'
import PublicFunc from '../common/publicFunc'
import BusinessException from '../common/businessException'
import BaseController from './baseController';
import Condition, {OpType, LogicOpType, JoinType, OrderType} from '../db/condition'
import {controller, route, Method} from '../common/decorator'
import Segment from '../segment'
import Path from 'path'

@controller('/movie')
export default class MovieController extends BaseController{
    constructor(){
        super();
        this._movieService = new MovieService();
        this._segment = new Segment(
            Path.resolve(__dirname, '../segment/stopword.txt'),
            Path.resolve(__dirname, '../segment/synonym.txt')
        );
    }

    /**
     * 获取电影列表
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @route('/getMovies')
    async getMovies(req, res, next) {
        try {            
            const {offset, pageSize, name, id, startYear, endYear, language, order} = req.query;
            const orders = [];
            if(order && order === 'avg'){
                orders.push({
                    key: 'average',
                    sequence: -1
                })
            }
            const condition = {
                name, id, startYear, endYear, language, orders
            }
            const resData = await this._movieService.getMoviesByCondition(condition, offset, pageSize);
            res.json({success: true, ...resData});
        }catch(e) {
            next(e);
        }
    }

    /**
     * 搜索电影
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @route('/searchMovie')
    async searchMovies(req, res, next) {
        try {            
            const {offset, pageSize} = req.query;
            let { keyWords } = req.query;
            const segmentResult = this._segment.doSegement(keyWords);
            //使用空格符连接分词
            keyWords = segmentResult.join(' ');
            if(keyWords){
                keyWords = encodeURIComponent(keyWords);
            }
            const resData = await this._movieService.getMoviesFromSolr({
                q: keyWords || '',
                start: offset,
                rows: pageSize
            })
            res.json({success: true, ...resData});
        }catch(e) {
            next(e);
        }
    }

    /**
     * 获取单个电影详细信息
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @route('/getMovieDetail')
    async getMoviesDetail(req, res, next){
        try {
            const {movieId} = req.query;
            const result = await this._movieService.getMovieDetailById(movieId);
            res.json({
                success: true,
                result
            })
        } catch (error) {
            next(error);
        }
    }

    /**
     * 保存或者修改电影
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */    
    @route('/newOrUpdate', Method.POST)
    async newOrUpdate(request, response, next) {
        try {
            let {movie} = request.body;
            const message = movie.moiveId ? '修改成功' : '新增成功';
            movie = await this._movieService.saveOrUpdateMovie(movie);
            response.json({
                success: true,
                result: movie,
                message
            });
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
    @route('/delete')
    async delete(request, response, next) {
        try {
            const {id} = request.query;
            const success = await this._movieService.deleteMovieById(id);
            response.json({success});
        }catch (e){
            next(e);
        }
    }

    /**
     * 上传电影海报
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @route('/uploadPoster', Method.POST)
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
     * 获取电影的分类统计信息
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @route('/getMoviesByGroup')
    async getMoviesByGroup(req, res, next){
        try {
            const group = req.query.group || '';
            const whereArray = JSON.parse(req.query.whereArray || '[]');
            if(!group){
                next(new BusinessException('分组字段不能为空'))
            }else{                
                const result = await this._movieService.getMoviesByGroup(group, whereArray);
                res.json({success: true, result});
            }
        }catch (e){
            next(e);
        }
    }

    /**
     * 获取电影的所有语言信息
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @route('/getLanguage')
    async getLanguage(req, res, next){
        try {
            res.json({
                success: true,
                result: await this._movieService.getLanguage()
            });
        } catch (error) {
            next(error);
        }
    }
}