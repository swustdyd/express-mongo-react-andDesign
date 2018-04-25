/**
 * Created by Aaron on 2018/1/9.
 */
const BaseConfig = require('../../baseConfig');
const log4js = require('log4js');
const path = require('path');
log4js.configure({
    appenders: {
        logDate:{
            type: 'dateFile',
            filename: path.join(BaseConfig.root, './logs/log'),
            alwaysIncludePattern: true,
            pattern: '-yyyy-MM-dd.log'
        }
    },
    categories: {
        default: {
            appenders: ['logDate'],
            level: BaseConfig.logLevel
        }
    }
});

const logger = log4js.getLogger('logDate');

const info = (...args) => {
    logger.info(...args);
};
const debug = (...args) => {
    logger.debug(...args)
};
const warning = (...args) => {
    logger.warn(...args)
};
const error =  (...args) => {
    logger.error(...args)
};

module.exports = {
    info,
    debug,
    warning,
    error
};