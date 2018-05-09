/**
 * Created by Aaron on 2018/5/7.
 */
/*** 测试代码 ***/
import express from 'express'
import logger from '../common/logger'
import BusinessException from '../common/businessException'
import HttpUtil from '../common/httpUtil'

const router = express.Router();

router.get('/log', function (request, response, next) {
    logger.info('info');
    logger.debug('debug');
    logger.warning('warning');
    logger.error('error', new Error('error by test'));
    next(new BusinessException('business exception'));
});

router.get('/download', async (req, res, next) => {
    try{
        let downloadPath = req.query.downloadPath;
        if(!downloadPath){
            res.json({success: false, message: 'downloadPath can\'t be null'});
            res.end();
        }
        HttpUtil.download(
            //url
            `http://119.27.187.248:3001/${path}`,
            //savePath
            path.join(BaseConfig.root, './public/test.pdf'),
            //callback
            (err, data) => {
                if(err){
                    next(err);
                }else {
                    res.send(data);
                }
            }
        );
    }catch (e){
        next(e);
    }
});

router.get('/js', (req, res, next) => {
    try {
        for(let i = 0; i < 10; i++){
            let j = i + 100;
        }
        res.error({message: 'test'});
    }catch (e){
        next(e)
    }
});

/**
 * 测试类
 */
class Test {
    /**
     * 
     * @param {*} a 
     * @param {*} b 
     */
    testMethod(a: number, b: string) : string {
        return 1;
    }
}

let test = new Test();

export default router;