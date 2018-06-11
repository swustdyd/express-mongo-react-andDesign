import MovieService from '../service/movie'
import PublicFunc from '../common/publicFunc'
import BusinessException from '../common/businessException'
import BaseController from './baseController';
import Condition, {OpType, LogicOpType} from '../db/condition'

export default class MovieController extends BaseController{
    constructor(){
        super();
        this._movieService = new MovieService();
    }

    /**
     * 获取电影列表
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getMovies(req, res, next) {
        try {            
            const {pageIndex, pageSize, name, id, startYear, endYear, language} = req.query;
            const condition = new Condition('movie', [
                {
                    name: 'movie.name',
                    as: 'showName'
                },
                {
                    name: 'movie.createAt'
                },
                {
                    name: 'a.akaName',
                    as: 'akaName'
                },
                {
                    name: 'l.languageName',
                    as: 'language'
                }
            ]);
            if(name){
                condition.addWhere({
                    name: 'name',
                    value: `${name}%`,
                    opType: OpType.LIKE,
                    logicOpType: LogicOpType.AND
                })
            }
            if(id){
                condition.addWhere({
                    name: 'movieId',
                    value: parseInt(id),
                    opType: OpType.EQ,
                    logicOpType: LogicOpType.AND
                })
            }

            if(startYear){
                condition.addWhere({
                    name: 'year',
                    value: parseInt(startYear),
                    opType: OpType.GTE,
                    logicOpType: LogicOpType.AND
                })
            }
            if(endYear){
                condition.addWhere({
                    name: 'year',
                    value: parseInt(endYear),
                    opType: OpType.LTE,
                    logicOpType: LogicOpType.AND
                })
            }

            if(language){
                condition.addWhere({
                    alias: 'l',
                    name: 'languageId',
                    value: parseInt(language),
                    opType: OpType.EQ,
                    logicOpType: LogicOpType.AND
                })
            }
            condition.addJoin({
                name: 'akaWithOther',
                alias: 'awo',
                on:{
                    sourceKey: 'otherId',
                    targetKey:{
                        alias: 'movie',
                        key: 'movieId'
                    }
                }
            })
            condition.addJoin({
                name: 'aka',
                alias: 'a',
                on:{
                    sourceKey: 'akaId',
                    targetKey:{
                        alias: 'awo',
                        key: 'akaId'
                    }
                }
            })
            condition.addJoin({
                name: 'languagemovie',
                alias: 'lm',
                on:{
                    sourceKey: 'movieId',
                    targetKey:{
                        alias: 'movie',
                        key: 'movieId'
                    }
                }
            })
            condition.addJoin({
                name: 'language',
                alias: 'l',
                on:{
                    sourceKey: 'languageId',
                    targetKey:{
                        alias: 'lm',
                        key: 'languageId'
                    }
                }
            })
            const resData = await this._movieService.getMoviesByCondition(condition);
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
                this._doubanMovieServie.getGroupInfoByYear({year: {$gte: 2000}}),
                this._doubanMovieServie.getGroupInfoByTypes(),
                this._doubanMovieServie.getGroupInfoByLanguages(),
                this._doubanMovieServie.getGroupInfoByCountries()
            ]);
            // const result = {
            //     year: dataList[0],
            //     types: dataList[1],
            //     languages: dataList[2],
            //     countries: dataList[3]
            // }
            const result = {
                year: dataList[0],
                types: [],
                languages: [],
                countries: []
            }
            dataList.forEach((items, index) => {
                switch (index) {
                    case 1:
                        items.forEach((item) => {
                            if(item.count >= 100){                                         
                                result.types.push(item)
                            }                   
                        })
                        break;
                    case 2:
                        items.forEach((item) => {
                            if(item.count >= 100){                                         
                                result.languages.push(item)
                            }                   
                        })
                        break;
                    case 3:
                        items.forEach((item) => {
                            if(item.count >= 100){                                         
                                result.countries.push(item)
                            }                   
                        })
                        break;
                    default:
                        break;
                }
            })
            res.json({success: true, result});
        } catch (error) {
            next(error);
        }
    }
}