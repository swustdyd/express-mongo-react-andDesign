/**
 * Created by Aaron on 2018/1/4.
 */
var express = require('express'),
    router = express.Router();
var Movie = require('../models/movie');

// list page
router.get('/', function (request, response) {
    Movie.fetch(function (err, movies) {
        if(err){
            console.log(err);
        }
        response.render('pages/list', {
            title: 'imooc 列表',
            movies: movies
        })
    });
});

module.exports = router;