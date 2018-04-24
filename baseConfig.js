/**
 * Created by Aaron on 2018/1/4.
 */
const path = require('path')

module.exports = {
    dbConnectString: 'mongodb://localhost:27017/imooc',
    devPort: 3000,
    proPort: 3001,
    staticPath: 'public',
    webpackPath: './public/dist',
    publicPath: 'dist/',
    root: path.resolve(__dirname),
    userDefaultIcon: '/images/default-icon.jpg'
};