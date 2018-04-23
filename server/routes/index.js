const logger = require('../common/logger');
const MovieService = require('../service/movie');

module.exports = function (app) {
    app.use('/movie', require('./movie'));
    app.use('/user', require('./user'));
    app.use('/comment', require('./comment'));

    app.get('/', function (request, response, next) {
        try {
            response.render('pages/index', {
                title: 'imooc 首页'
            })
        }catch (e){
            next(e)
        }
    });

    app.get('/test', function (request, response, next) {
        asyncTest().then(result => {
            response.app.set('jsonp callback name', 'jsonpssCallback');
            response.jsonp(result);
        }).catch( err => next(err) );
    });

    async function asyncTest() {
        return await MovieService.getMoviesByCondition();
    }
};
