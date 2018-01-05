/**
 * Created by Aaron on 2018/1/4.
 */
var express = require('express'),
    router = express.Router();
var Movie = require('../models/movie');

// detail page
router.get('/movie/:id', function (request, response) {
    var id =  request.params.id;
    Movie.findById(id, function (err, movie) {
        response.render('pages/detail', {
            title: 'imooc 详情页',
            movie: movie
        })
    })
});

module.exports = router;