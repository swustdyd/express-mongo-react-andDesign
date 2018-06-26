import redis from 'redis'
import bluebird from 'bluebird'
import looger from '../common/logger'
import ErrorCode from '../common/errorCode'

bluebird.promisifyAll(redis);

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
    password: 'dd89757000'
})
    
const LOCK_SUCCESS = 'OK';
const IF_EXIST_NOT_SET = 'NX';

export const LockCode = {
    REDIS_LOCK_EXIST: 1
}

export default class RedisRock {
    /**
     * 加锁
     * @param {*} key 锁名
     * @param {*} uuid 加锁的身份标识
     * @param {*} ttl 自动释放锁的时间，单位：s
     */
    static async lock(key: string, uuid: string, ttl: number = 5) {        
        const result = {
            success: true
        };
        try {
            const setResult = await redisClient.setAsync(key, uuid, 'EX', ttl, IF_EXIST_NOT_SET);
            if(setResult !== LOCK_SUCCESS){
                result.success = false;
                result.message = `锁(${key})已存在`;
                result.code = LockCode.REDIS_LOCK_EXIST;
            }           
        } catch (error) {
            logger.error(error);
            result.success = false;
            result.message = error.message;
        }
        return result;
    }

    /**
     * 解锁
     * @param {*} key 锁名
     * @param {*} uuid 解锁的身份标识
     */
    static async unlock(key: string, uuid: string): Promise<{success: boolean, message: string}> {
        const result = {
            success: true
        };
        try {            
            const getResult = await redisClient.getAsync(key);
            if(!getResult){
                result.success = false;
                result.message = `锁(${key})不存在`;
            }else if(getResult === uuid){
                await redisClient.delAsync(key);
            }else{
                result.success = false;
                result.message = `锁(${key}, ${uuid})的身份验证失败`;
            }
        } catch (error) {
            logger.error(error);
            result.success = false;
            result.message = error.message;
        }
        return result;
    }
}

// async function test(){
//     const key = 'test';
//     const uuid = '123456';
//     for(let i = 0; i < 10; i++){
//         console.log(await RedisClient.lock(key, uuid));
//         await RedisClient.unlock(key, 'uuid')
//     }
// }

// (async function(){
//     await test();
//     process.exit();
// })();