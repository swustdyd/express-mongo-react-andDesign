/**
 * Created by Aaron on 2018/1/6.
 */
var express = require('express'),
    router = express.Router();
var Movie = require('../models/movie');
var _ = require('underscore');
var logger = require('../common/logger');
var MovieService = require('../service/movie');
var CommentService = require('../service/comment');
var Promise = require('promise');

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
    var movie = request.body.movie;
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

module.exports = router;