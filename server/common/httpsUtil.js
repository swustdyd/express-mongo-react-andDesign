/**
 * Created by Aaron on 2018/4/27.
 */
import https from 'https'

export default class HttpsUtil {
    /**
     * https get 同步方法
     * @param {*} options 请求的配置
     * @param {*} resEncoding 对response的编码，不设置则返回buffer
     */
    static getAsync(options: {}|string|URL, resEncoding?: string) : Promise<{statusCode: number, headers: {}, body: string|Buffer}>{
        //options = Object.assign({}, options, { method: 'GET'});
        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                if(resEncoding){
                    res.setEncoding(resEncoding);
                }
                const resData = {
                    statusCode: res.statusCode,
                    headers: res.headers
                };
                const dataList = [];
                res.on('data', (data) => {
                    //该回调会多次调用，直到将响应主体的数据读完
                    dataList.push(data);
                });
                res.on('end', () => {
                    let body = '';
                    if(resEncoding){
                        body = dataList.join('');
                    }else{
                        body = Buffer.concat(dataList);
                    }
                    resolve({body, ...resData});
                })
            });
            req.on('error', (e) => {
                console.error('http util error', e.message);
                reject(e);
            });
            req.end();
        });
    }
}