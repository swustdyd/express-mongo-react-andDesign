/**
 * Created by Aaron on 2018/1/4.
 */
const path = require('path')

module.exports = {
    dbConnectString: 'mongodb://localhost:27017/imooc',
    clientPort: 3000,
    serverPort: 3001,
    staticPath: 'public',
    webpackPath: '../public/dist',
    publicPath: 'dist/',
    root: path.resolve(__dirname),
    userDefaultIcon: '/images/default-icon.jpg',
    indexPageTitle: 'Demo 首页',
    logLevel: 'info'
};