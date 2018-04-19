const Movie = require('../models/movie');
const logger = require('../common/logger');
const MovieService = require('../service/movie');

module.exports = function (app) {
    app.use('/movie', require('./movie'));
    app.use('/user', require('./user'));
    app.use('/comment', require('./comment'));

    app.get('/', function (request, response) {
        //logger.info(request.sessionID);
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

    app.get('/test', function (request, response) {
        asyncTest().then(result => {
            response.app.set('jsonp callback name', 'jsonpssCallback');
            response.jsonp(result);
        });

    });

    async function asyncTest() {
        return await MovieService.getMoviesByCondition();
    }
};
