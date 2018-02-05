/**
 * Created by Aaron on 2018/1/6.
 */
var express = require('express'),
    router = express.Router();
var Movie = require('../models/movie');
var _ = require('underscore');
//var Comment = require('../models/comment');
var logger = require('../common/logger');
var MovieService = require('../service/movie');
var CommentService = require('../service/comment');
var Promise = require('promise');

/**
 * 电影列表页
 */
router.get('/list.html', function (request, response) {
    MovieService.getMoviesByCondition().then(function (movies) {
        response.render('pages/movie/list', {
            title: 'imooc 电影列表页',
            movies: movies
        });
    }).catch(function (e) {
        logger.error(e);
        response.render('pages/error', {
            error: e
        })
    });
});

// mvoie detail page
router.get('/detail.html/:id', function (request, response) {
    var id =  request.params.id;
    Promise.all([
        CommentService.getCommentsByMovieId(id,{
            sort: {
                'meta.createAt': 'desc'
            }
        }),
        MovieService.getMovieById(id)
    ]).then(function (data) {
        response.render('pages/movie/detail', {
            title: 'imooc 详情页',
            movie: data[1],
            comments: data[0]
        })
    }).catch(function (e) {
        logger.error(e);
        response.render('pages/error', {
            error: e
        })
    });
});

// movie new page
router.get('/new.html', function (request, response) {
    response.render('pages/movie/edit', {
        title: 'imooc 录入页',
        movie: ''
    })
});

// movie newOrUpdate action
router.post('/newOrUpdate', function (request, response) {
    var id = request.body.movie._id;
    var movieObj = request.body.movie;
    var _movie;
    if(id){
        Movie.findById(id, function (err, movie) {
            if(err){
                throw err;
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if(err){
                    throw err;
                }
                response.redirect('/movie/list.html');
            })
        })
    }else{
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        _movie.save(function (err, movie) {
            if(err){
                throw err;
            }
            response.redirect('/movie/list.html');
        })
    }
});

//movie update page
router.get('/update.html/:id', function (request, response) {
    var id =  request.params.id;
    MovieService.getMovieById(id).then(function (movie) {
        response.render('pages/movie/edit', {
            title: 'imooc 更新页',
            movie: movie
        })
    }).catch(function (e) {
        logger.error(e);
        response.render('pages/error', { error: e })
    });
});

// movie delete movie
router.get('/delete', function (request, response) {
    var id = request.query.id;
    MovieService.deleteMovieById(id).then(function (result) {
        if(result){
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