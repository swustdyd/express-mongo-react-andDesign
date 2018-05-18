import mongoose from 'mongoose'
import logger from '../common/logger'
import ProxyFactory from './proxyFactory'
import BaseConfig from '../../baseConfig'

mongoose.connect(BaseConfig.dbConnectString);

const proxyFactory = new ProxyFactory();

process.nextTick(async () => {
    try {
        await proxyFactory.createxicidaili();
    } catch (error) {
        logger.error(error);
    }
    process.exit();
})