var Movie = require('../models/movie');
var logger = require('../common/logger');
var MovieService = require('../service/movie');

module.exports = function (app) {
    app.use('/movie', require('./movie'));
    app.use('/user', require('./user'));
    app.use('/comment', require('./comment'));

    app.get('/', function (request, response) {
        logger.info(request.sessionID);
        MovieService.getMoviesByCondition()
            .then(function (resData) {
                response.render('pages/index', {
                    title: 'imooc 首页',
                    movies: resData.result
                })
            }).catch(function (err) {
                //logger.error(err);
                throw err;
        });
    });
};
