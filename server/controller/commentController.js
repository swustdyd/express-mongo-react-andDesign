/*
 * @Author: yedong.deng 
 * @Date: 2018-05-10 17:24:17 
 * @Last Modified by:   aaron.deng 
 * @Last Modified time: 2018-05-10 17:24:17 
 */
import Authority from '../common/authority'
import CommentService from '../service/comment'
import BaseController from './baseController'

/**
 * 评论模块的controller
 */
export default class CommentController extends BaseController{
    constructor(){
        super();
        this.commentService = new CommentService();
    }

    /**
     * 提交一个评论
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async commitComment(req, res, next){
        try {
            const {user: currentUser} = req.session;
            let {comment} = req.body;
            comment.from = currentUser._id;
            let resData = await this.commentService.saveOrUpdateComment(comment);
            comment = resData.result;
            //再次查询，带出from与to
            resData = await this.commentService.getCommentById(comment._id);
            comment = resData.result;
    
            //查询同一电影，同级的评论条数
            const condition = {
                level: comment.level,
                movie: comment.movie
            };
            if(comment.replayTo){
                condition.replayTo = comment.replayTo;
            }
            resData = await this.commentService.getCommentsByCondition({
                condition: condition,
                pageIndex: 0,
                pageSize: 1
            });
            res.json({
                success: true,
                result: comment,
                total: resData.total
            });
        }catch (e){
            next(e);
        }
    }

    /**
     * 根据电影id获取评论
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getCommentByMovieId(req, res, next){
        try{
            const movieId = req.params.id,
                {pageIndex, pageSize, level, condition = '{}'} = req.query;
            const newCondition = JSON.parse(req.query.condition);
            const resData = await this.commentService.getCommentsByMovieId(movieId, {
                condition: {
                    level: level,
                    ...newCondition
                },
                pageIndex,
                pageSize,
                sort: {
                    'meta.createAt': 1
                }
            });
            res.json(resData);
        }catch (e){
            next(e);
        }
    }
}