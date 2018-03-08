/**
 * Created by Aaron on 2018/1/6.
 */
const express = require('express'),
    router = express.Router();
const Movie = require('../models/movie');
const _ = require('underscore');
const logger = require('../common/logger');
const MovieService = require('../service/movie');
const CommentService = require('../service/comment');
const Promise = require('promise');
const PublicFunc = require('../common/publicFunc');

/**
 * 获取电影列表
 */
router.get('/getMovies', function (req, res) {
    let condition = req.query.condition || '{}';
    condition = JSON.parse(condition);
    MovieService.getMoviesByCondition({
        condition: condition
    })
    .then(function (resData) {
        res.json({
            success: true,
            result: resData.result
        })
    }).catch(function (err) {
        //logger.error(err);
        throw err;
    });
});

/**
 * 保存或者修改电影
 */
router.post('/newOrUpdate', function (request, response) {
    let movie = request.body.movie;
    logger.info(request.session.movieUploadPoster);
    if(request.session.movieUploadPoster){
        movie.poster = request.session.movieUploadPoster;
        request.session.movieUploadPoster = undefined;
    }
    MovieService.saveOrUpdateMovie(movie).then(function (resData) {
        response.json({
            success: true,
            message: resData.message
        })
    }).catch(function (err) {
        logger.error(err);
        response.json({
            success: false,
            message: err.message
        })
    });
});


/**
 * 删除电影
 */
router.get('/delete', function (request, response) {
    let id = request.query.id;
    MovieService.deleteMovieById(id).then(function (resData) {
        if(resData.success){
            response.json({ success: true, message: '删除成功'});
        }else{
            response.json({ success: false, message: '删除失败'});
        }
    }).catch(function (err) {
        logger.error(err);
        response.json({ success: false, message: err.message});
    });
});

router.post('/uploadPoster', function (req, res) {
    PublicFunc.uploadFiles(req, res, {
        subDir: 'movie/poster',
        fileFilter: ['.png', '.jpg']
    }).then(function (files) {
        req.session.movieUploadPoster = {
            filename: files[0].filename,
            displayName: files[0].originalname,
            src: `uploads/movie/poster/${files[0].filename}`
        };
        //logger.info(req.sessionID);
        res.json({success: true, message: 'hahaha', result: files});
    }).catch(function (err) {
        logger.error(err);
        res.json({success: false, message: err.message});
    });
});

module.exports = router;