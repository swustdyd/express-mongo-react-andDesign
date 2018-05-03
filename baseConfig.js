/**
 * Created by Aaron on 2018/1/4.
 */
const path = require('path')

const config = {
    dbConnectString: 'mongodb://localhost:27017/imooc',
    clientHost: 'http://localhost',
    clientPort: 3000,
    serverHost: 'http://localhost',
    serverPort: 3001,
    staticPath: 'public',
    root: path.resolve(__dirname),
    indexPageTitle: 'Demo 首页1234',
    logLevel: 'info'
};


config.userDefaultIcon = `${config.serverHost}:${config.serverPort}/images/default-icon.jpg`;

module.exports = config;