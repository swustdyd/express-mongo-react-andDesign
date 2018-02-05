var Movie = require('../models/movie');
var logger = require('../common/logger');

module.exports = function (app) {
    app.use('/movie', require('./movie'));
    app.use('/user', require('./user'));
    app.use('/comment', require('./comment'));

    app.get('/', function (request, response) {
        Movie.fetch(function (err, movies) {
            if(err){
                throw err;
            }
            response.render('pages/index', {
                title: 'imooc 首页',
                movies: movies
            })
        });
    });
};
