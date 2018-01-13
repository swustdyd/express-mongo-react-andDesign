/**
 * Created by Aaron on 2018/1/6.
 */
var express = require('express'),
    router = express.Router();
var Movie = require('../models/movie');
var _ = require('underscore');

// movie movie page
router.get('/list.html', function (request, response) {
    Movie.fetch(function (err, movies) {
        if(err){
            throw err;
        }
        response.render('pages/movie/list', {
            title: 'imooc 电影列表页',
            movies: movies
        })
    });
});

// mvoie detail page
router.get('/detail.html/:id', function (request, response) {
    var id =  request.params.id;
    Movie.findById(id, function (err, movie) {
        if(err){
            throw err;
        }
        response.render('pages/movie/detail', {
            title: 'imooc 详情页',
            movie: movie
        })
    })
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
    }
    _movie.save(function (err, movie) {
        if(err){
            throw err;
        }
        response.redirect('/movie/list.html');
    })
});

//movie update page
router.get('/update.html/:id', function (request, response) {
    var id =  request.params.id;
    Movie.findById(id, function (err, movie) {
        if(err){
            throw err;
        }
        response.render('pages/movie/edit', {
            title: 'imooc 更新页',
            movie: movie
        })
    })
});

// movie delete movie
router.get('/delete', function (request, response) {
    var id = request.query.id;
    if(id){
        Movie.remove({_id: id}, function (err, movie) {
            if(err){
                throw err;
            }
            response.json({ success: true, message: '删除成功'});
        })
    }else{
        response.json({ success: false, message: 'id不能为空'});
    }

});

module.exports = router;