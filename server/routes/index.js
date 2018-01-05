var Movie = require('../models/movie');

module.exports = function (app) {
    app.use(require('./admin'));
    app.use(require('./detail'));
    app.use(require('./list'));
    app.use(require('./user'));

    app.get('/', function (request, response) {
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
