//格式化输出信息
var morgan = require('morgan');
//文件的创建
var fs = require('fs');
//自定义error
var errorHandle = require('./server/common/errorHandle');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
//body-parser 可将user[name]这种参数转化为user对象
var bodyParser = require('body-parser');
//使用connect-mongo,cookie-parser,express-session做session持久化
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var isDev = process.env.NODE_ENV !== 'production';
var baseConfig = require('./baseConfig');
var app = express();
var port = process.env.PORT || baseConfig.port;
port = parseInt(port, 10);

mongoose.connect('mongodb://localhost:27017/imooc');

//设置模板引擎为jade
app.set('view engine', 'jade');
app.set('views', path.resolve(__dirname, './server/views'));

// local variables for all views
app.locals.env = process.env.NODE_ENV || 'dev';
app.locals.reload = true;
app.locals.moment = require('moment');
app.locals.logLevel = 'info';

app.use(bodyParser());
app.use(cookieParser());
app.use(session({
    secret: 'imooc',
    store: new MongoStore({
        mongooseConnection: mongoose.connection
        //ttl: 30 * 60// 30 minute 存储在mongo的有效时间，默认为14天，过期后会自动删除
    }),
    cookie: {
        maxAge: 30 * 60 * 1000// 30 minute session和cookie的有效时间，默认是浏览器关闭，该设置优先级大于ttl
    },
    rolling: true,
    resave: true,
    saveUninitialized: false
}));
if(isDev){
    app.use(morgan('dev'));
}else{
    app.use(morgan('combined', {
        stream: fs.createWriteStream(path.join(__dirname, 'access.log'))
    }));
}

//在引用所有路由前，可在此做拦截器
app.use(function (req, res, next) {
    //console.log("locals.user: " + app.locals.user);
    //当session过期之后，需要手动删除app.locals.user，系统不会自动删除
    if(req.session.user){
        app.locals.user = req.session.user;
    }else{
        delete app.locals.user;
    }
    next();
});

//设置路由
require('./server/routes')(app);

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

    // add "reload" to express, see: https://www.npmjs.com/package/reload
    var reload = require('reload');
    var http = require('http');

    var server = http.createServer(app);
    reload(server, app);

    //放在所有的routes和static资源的匹配后面，匹配到该处，证明为404
    errorHandle(app);
    server.listen(port, function(){
        console.log('App (dev) is now running on port 3000!');
    });
} else {
    // static assets served by express.static() for production
    app.use(express.static(path.join(__dirname, baseConfig.webpackPath)));
    //放在所有的routes和static资源的匹配后面，匹配到该处，证明为404
    errorHandle(app);
    app.listen(port, function () {
        console.log('App (production) is now running on port 3000!');
    });
}

