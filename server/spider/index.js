import mongoose from 'mongoose'
import logger from '../common/logger'
import DoubanSpider from './doubanSpider'
import BaseConfig from '../../baseConfig'

mongoose.connect(BaseConfig.dbConnectString);
const doubanSpider = new DoubanSpider();    

process.nextTick(async () => {
    try {
        await doubanSpider.start();
    } catch (error) {
        logger.error(error);
    }
    await mongoose.disconnect();
    process.exit();
})