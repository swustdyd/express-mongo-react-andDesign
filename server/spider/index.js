import mongoose from 'mongoose'
import logger from '../common/logger'
import DoubanSpider from './doubanSpider'
import BaseConfig from '../../baseConfig'

mongoose.connect(BaseConfig.dbConnectString);

process.nextTick(async () => {
    try {
        const doubanSpider = new DoubanSpider();    
        await doubanSpider.start();
    } catch (error) {
        logger.error(error);
    }
    await mongoose.disconnect();
    process.exit();
})