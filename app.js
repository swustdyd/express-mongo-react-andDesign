var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var isDev = process.env.NODE_ENV !== 'production';
var baseConfig = require('./baseConfig');
var app = express();

mongoose.connect('mongodb://localhost:27017/imooc');

app.set('view engine', 'jade');
app.use(bodyParser());
app.set('views', path.resolve(__dirname, './server/views'));

// local variables for all views
app.locals.env = process.env.NODE_ENV || 'dev';
app.locals.reload = true;
app.locals.moment = require('moment');
var port = process.env.PORT || baseConfig.port;
port = parseInt(port, 10);

if (isDev) {
    // static assets served by webpack-dev-middleware & webpack-hot-middleware for development
    var webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpackDevConfig = require('./webpack.config.js');

    var compiler = webpack(webpackDevConfig);

    // attach to the compiler & the server
    app.use(webpackDevMiddleware(compiler, {

        // public path should be the same with webpack config
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true
        }
    }));
    app.use(webpackHotMiddleware(compiler));
    require('./server/routes')(app);

    // add "reload" to express, see: https://www.npmjs.com/package/reload
    var reload = require('reload');
    var http = require('http');

    var server = http.createServer(app);
    reload(server, app);

    server.listen(port, function(){
        console.log('App (dev) is now running on port 3000!');
    });
} else {

    // static assets served by express.static() for production
    app.use(express.static(path.join(__dirname, baseConfig.webpackPath)));
    require('./server/routes')(app);
    app.listen(port, function () {
        console.log('App (production) is now running on port 3000!');
    });
}
