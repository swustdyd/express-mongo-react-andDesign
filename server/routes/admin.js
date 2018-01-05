/**
 * Created by Aaron on 2018/1/4.
 */
var express = require('express'),
    router = express.Router();
var Movie = require('../models/movie');
var _ = require('underscore');

// admin page
router.get('/', function (request, response) {
    response.render('pages/admin', {
        title: 'imooc 录入页',
        movie: {
            _id: '',
            doctor: '',
            title: '',
            country: '',
            language: '',
            year: '',
            poster: '',
            summary: '',
            flash: ''
        }
    })
});

// admin post movie
router.post('/movie/new', function (request, response) {
    var id = request.body.movie._id;
    var movieObj = request.body.movie;
    var _movie;
    if(id){
        Movie.findById(id, function (err, movie) {
            if(err){
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if(err){
                    console.log(err);
                }
                response.redirect('/detail/movie/' + movie._id)
            });
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
                console.log(err);
            }
            response.redirect('/detail/movie/' + movie._id)
        })
    }
});

//admin update page
router.get('/update/:id', function (request, response) {
    var id =  request.params.id;
    Movie.findById(id, function (err, movie) {
        response.render('pages/admin', {
            title: 'imooc 更新页',
            movie: movie
        })
    })
});

//delete movie
router.get('/movie/delete', function (request, response) {
    var id = request.query.id;
    if(id){
        Movie.remove({_id: id}, function (err, movie) {
            if(err){
                console.log(err);
                response.json({ success: false, message: '删除失败'});
            }else{
                response.json({ success: true, message: '删除成功'});
            }
        })
    }else{
        response.json({ success: false, message: 'id不能为空'});
    }

});

module.exports = router;