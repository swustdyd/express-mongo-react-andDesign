//async await
require('babel-core/register')

//格式化输出信息
const morgan = require('morgan');
const compression = require('compression')
//文件的创建
const fs = require('fs');
//自定义error
const errorHandle = require('./server/common/errorHandle');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
//body-parser 可将user[name]这种参数转化为user对象
const bodyParser = require('body-parser');
//使用connect-mongo,cookie-parser,express-session做session持久化
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const isDev = process.env.NODE_ENV !== 'production';
const BaseConfig = require('./baseConfig');
const app = express();
const filter = require('./server/common/filter');
let devPort = process.env.PORT || BaseConfig.devPort;
let proPort = process.env.PORT || BaseConfig.proPort;
devPort = parseInt(devPort, 10);
proPort = parseInt(proPort, 10);

mongoose.connect(BaseConfig.dbConnectString);

//设置模板引擎为jade
app.set('view engine', 'jade');
app.set('views', path.resolve(__dirname, './server/views'));

// local variables for all views
app.locals.env = process.env.NODE_ENV || 'dev';
app.locals.reload = true;
app.locals.moment = require('moment');

//开启gzip
app.use(compression());
app.use(bodyParser());
//filter
app.use(filter);
app.use(cookieParser());
app.use(session({
    secret: 'demo',
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


app.use(express.static(path.join(__dirname, 'public')));//设置静态目录

//在引用所有路由前，可在此做拦截器
app.use(function (req, res, next) {
    //console.log("locals.user: " + app.locals.user);
    //当session过期之后，需要手动删除app.locals.user，系统不会自动删除
    if(req.session.user){
        app.locals.user = req.session.user.name;
    }else{
        delete app.locals.user;
    }
    next();
});

//设置路由
require('./server/routes')(app);

if (isDev) {
    // static assets served by webpack-dev-middleware & webpack-hot-middleware for development
    let webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpackDevConfig = require('./webpack.config.js');

    let compiler = webpack(webpackDevConfig);

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
    let reload = require('reload');
    let http = require('http');

    let server = http.createServer(app);
    reload(server, app);

    //放在所有的routes和static资源的匹配后面，匹配到该处，证明为404
    //app.use(errorHandle);
    server.listen(devPort, function(){
        console.log('App (dev) is now running on devPort '+devPort+'!');
    });
} else {
    // static assets served by express.static() for production
    //app.use(express.static(path.join(__dirname, BaseConfig.webpackPath)));
    //放在所有的routes和static资源的匹配后面，匹配到该处，证明为404
    //app.use(errorHandle);
    app.listen(proPort, function () {
        console.log('App (production) is now running on proPort '+proPort+'!');
    });
}
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//统一处理异常返回
app.use(errorHandle);

