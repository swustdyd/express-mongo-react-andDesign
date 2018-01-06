var Movie = require('../models/movie');

module.exports = function (app) {
    app.use('/movie', require('./movie'));
    app.use('/user', require('./user'));

    app.get('/', function (request, response) {

        //throw new Error('error');
        Movie.fetch(function (err, movies) {
            if(err){
                console.log(err);
            }
            response.render('pages/index', {
                title: 'imooc 首页',
                movies: movies
            })
        });
    });
};
