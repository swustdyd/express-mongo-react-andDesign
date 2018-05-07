//格式化输出信息
//const morgan = require('morgan');
import morgan from 'morgan'
import compression from 'compression'
import fs from 'fs'
import errorHandle from './common/errorHandle'
import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import filter from './common/filter'
import BaseConfig from '../baseConfig'
import Route from './routes'

const MongoStore = connectMongo(session);
const isDev = process.env.NODE_ENV !== 'production';
const app = express();

let serverPort = process.env.PORT || BaseConfig.serverPort;
serverPort = parseInt(serverPort, 10);

mongoose.connect(BaseConfig.dbConnectString);

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
        stream: fs.createWriteStream(path.join(BaseConfig.root, 'logs/access.log'))
    }));
}

app.use(express.static(path.join(BaseConfig.root, 'public')));//设置静态目录

//在引用所有路由前，可在此做拦截器
app.use(function (req, res, next) {
    //console.log("locals.user: " + app.locals.user);
    //当session过期之后，需要手动删除app.locals.user，系统不会自动删除
    if(req.session.user){
        app.locals.user = req.session.user.name;
    }else{
        delete app.locals.user;
    }
    res.header('Access-Control-Allow-Origin', `${BaseConfig.clientHost}:${BaseConfig.clientPort}`);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

//设置路由
app.use(Route);


app.listen(serverPort, function () {
    console.log(`Demo(production) is running on port ${serverPort}`);
});

//统一处理异常返回
app.use(errorHandle);

