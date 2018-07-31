/**
 * Created by Aaron on 2018/1/4.
 */
const path = require('path');
const serverHost = 'http://localhost';
const serverPort = 3001;

const config = {
    dbConnectString: 'mongodb://localhost:27017/imooc',
    clientHost: 'http://localhost',
    clientPort: 3000,
    serverHost: serverHost,
    serverPort: serverPort,
    staticPath: 'public',
    root: path.resolve(__dirname),
    indexPageTitle: 'Demo 首页',
    logLevel: 'info',
    dateFormatString: 'YYYY-MM-DD HH:mm:ss',
    dayFormatString: 'YYYY-MM-DD',
    tokenSecret: 'qwertyuiop',    
    staticSourceHost: serverHost + ':' + serverPort,
    userDefaultIcon: serverHost + ':' + serverPort + '/images/default-icon.jpg',
    solrBaseUrl: 'http://localhost:8080/solr/movie_core/select'
};


module.exports = config;