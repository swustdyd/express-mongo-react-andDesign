/**
 * Created by Aaron on 2018/1/9.
 */
import log4js from 'log4js'
import path from 'path'
import BaseConfig from '../../../baseConfig'

log4js.configure({
    appenders: [
        {
            type: 'dateFile',
            filename: path.join(BaseConfig.root, './logs/log'),
            alwaysIncludePattern: true,
            pattern: '-yyyy-MM-dd.log'
        }
    ]
});

const logger = log4js.getLogger('logDate');

export default logger;

