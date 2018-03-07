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
 * 电影列表页
 */
router.get('/list.html', function (request, response) {
    MovieService.getMoviesByCondition().then(function (resData) {
        response.render('pages/movie/list', {
            title: 'imooc 电影列表页',
            movies: resData.result
        });
    }).catch(function (e) {
        logger.error(e);
        response.render('pages/error', {
            error: e
        })
    });
});

/**
 * 获取电影列表
 */
router.get('/getMovies', function (req, res) {
    MovieService.getMoviesByCondition()
        .then(function (resData) {
            resData.result.forEach((item, index) => {
                item.poster = `/uploads/movie/poster/${item.poster}`;
            });
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
 * 电影详情页
 */
router.get('/detail.html/:id', function (request, response) {
    var id =  request.params.id;
    Promise.all([
        MovieService.getMovieById(id),
        CommentService.getCommentsByMovieId(id,{
            sort: {
                'meta.createAt': 'desc'
            }
        })
    ]).then(function (data) {
        response.render('pages/movie/detail', {
            title: 'imooc 详情页',
            movie: data[0].result,
            comments: data[1].result
        })
    }).catch(function (e) {
        logger.error(e);
        response.render('pages/error', {
            error: e
        })
    });
});

/**
 * 电影新增页面
 */
router.get('/new.html', function (request, response) {
    response.render('pages/movie/edit', {
        title: 'imooc 录入页',
        movie: ''
    })
});

/**
 * 保存或者修改电影
 */
router.post('/newOrUpdate', function (request, response) {
    let movie = request.body.movie;
    movie.poster = request.session.movieUploadPoster || '';
     request.session.movieUploadPoster = undefined;
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
 * 电影编辑页面
 */
router.get('/editMovie.html/:id', function (request, response) {
    var id =  request.params.id;
    MovieService.getMovieById(id).then(function (resData) {
        response.render('pages/movie/edit', {
            title: 'imooc 更新页',
            movie: resData.result
        })
    }).catch(function (e) {
        logger.error(e);
        response.render('pages/error', { error: e })
    });
});

/**
 * 删除电影
 */
router.get('/delete', function (request, response) {
    var id = request.query.id;
    MovieService.deleteMovieById(id).then(function (resData) {
        if(resData.success){
            response.json({ success: true, message: '删除成功'});
        }else{
            response.json({ success: false, message: '删除失败'});
        }
    }).catch(function (err) {
        logger.error(err);
        response.json({ success: false, message: '删除失败'});
    });
});

router.post('/uploadPoster', function (req, res) {
    PublicFunc.uploadFiles(req, res, {
        subDir: 'movie/poster',
        fileFilter: ['.png', '.jpg']
    }).then(function (files) {
        req.session.movieUploadPoster = files[0].filename;
        //logger.info(req.sessionID);
        res.json({success: true, message: 'hahaha', result: files});
    }).catch(function (err) {
        logger.error(err);
        res.json({success: false, message: err.message});
    });
});

module.exports = router;