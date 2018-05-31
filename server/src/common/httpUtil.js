/**
 * Created by Aaron on 2018/4/27.
 */
import http from 'http'
import ProgressBar from 'progress'
import fs from 'fs'

export default class HttpUtil {
    /**
     * http get 同步方法
     * @param {*} options 请求的配置
     * @param {*} resEncoding 对response的编码，不设置则返回buffer
     */
    static getAsync(options: {}|string|URL, resEncoding?: string) : Promise<{statusCode: number, headers: {}, data: string|Buffer}>{
        options = Object.assign({}, options, { method: 'GET'});
        return new Promise((resolve, reject) => {
            const req = http.request(options, (res) => {
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
                    let data = '';
                    if(resEncoding){
                        data = dataList.join('');
                    }else{
                        data = Buffer.concat(dataList);
                    }
                    resolve({data, ...resData});
                })
            });
            req.on('error', (e) => {
                console.error('http util error', e.message);
                reject(e);
            });
            req.end();
        });
    }
    
    /**
     * http post 同步方法
     * @param {*} options 请求的配置
     * @param {*} postData post的数据
     * @param {*} resEncoding 对response的编码，不设置则返回buffer
     */
    static postAsync(options: {}|string|URL, postData?: any, resEncoding?: string) : Promise<{statusCode: number, headers: {}, data: string|Buffer}>{
        options = Object.assign({}, options, { method: 'POST'});
        return new Promise((resolve, reject) => {
            const req = http.request(options, (res) => {
                if(resEncoding){
                    res.setEncoding(resEncoding);
                }
                const resData = {
                    statusCode: res.statusCode,
                    headers: res.headers
                };
                const dataList = [];
                res.on('data', (data) => {
                    dataList.push(data);
                });
                res.on('end', () => {
                    let data = '';
                    if(resEncoding){
                        data = dataList.join('');
                    }else{
                        data = Buffer.concat(dataList);
                    }
                    resolve({data, ...resData});
                })
            });
            req.on('error', (e) => {
                console.error('http util error', e.message);
                reject(e);
            });
            req.write(postData);
            req.end();
        });
    }

    /**
     * 
     * @param {*} url 下载路径
     * @param {*} savePath 服务器保存路径
     * @param {*} callback 回调方法
     */
    static download(url: string, savePath: string, callback?: (err: null|Error, headers: {}) => void){
        try{
            const httpRequest = http.request(url, (httpResponse) => {
                const success = httpResponse.statusCode === 200;
                if(success){
                    const contentLength = parseInt(httpResponse.headers['content-length']);
                    const bar = new ProgressBar('downloading [:bar] :rate/bps :percent :etas', {
                        complete: '=',
                        incomplete: ' ',
                        width: 60,
                        total: contentLength
                    });
                    httpResponse.on('data', (chunk) => {
                        bar.tick(chunk.length);
                    });
                    const writable = fs.createWriteStream(savePath);
                    httpResponse.pipe(writable);
                    httpResponse.on('end', () => {
                        console.log('download complete');
                        callback(null, httpResponse.headers);
                    })
                }else {
                    httpResponse.setEncoding('utf8');
                    let errData = '';
                    httpResponse.on('data', (chunk) => {
                        errData += chunk;
                    });
                    httpResponse.on('end', () => {
                        callback(new Error(`download error, code is '${httpResponse.statusCode}'\n${errData}`));
                    })
                }

            });
            httpRequest.on('error', (e) => {
                if(callback){
                    callback(e);
                }
            });
            httpRequest.end();
        }catch (e){
            if(callback){
                callback(e);
            }
        }
    }
}