/**
 * Created by Aaron on 2018/4/27.
 */
const http = require('http');
const ProgressBar = require('progress');
const fs = require('fs');

class HttpUtil {
    static getAsync(options, resEncoding){
        options = Object.assign({}, options, { method: 'GET'});
        return new Promise((resolve, reject) => {
            const req = http.request(options, res => {
                if(resEncoding){
                    res.setEncoding(resEncoding);
                }
                let resData = {
                    statusCode: res.statusCode,
                    headers: res.headers
                };
                let dataList = [];
                res.on('data', data => {
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
            req.on('error', e => {
                console.error('http util error', e.message);
                reject(e);
            });
            req.end();
        });
    }

    static postAsync(options, postData, resEncoding){
        options = Object.assign({}, options, { method: 'POST'});
        return new Promise((resolve, reject) => {
            const req = http.request(options, res => {
                if(resEncoding){
                    res.setEncoding(resEncoding);
                }
                let resData = {
                    statusCode: res.statusCode,
                    headers: res.headers
                };
                let dataList = [];
                res.on('data', data => {
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
            req.on('error', e => {
                console.error('http util error', e.message);
                reject(e);
            });
            req.write(postData);
            req.end();
        });
    }

    static download(url, savePath, cb){
        try{
            let httpRequest = http.request(url, httpResponse => {
                const success = httpResponse.statusCode === 200;
                if(success){
                    const contentLength = parseInt(httpResponse.headers['content-length']);
                    let bar = new ProgressBar('downloading [:bar] :rate/bps :percent :etas', {
                        complete: '=',
                        incomplete: ' ',
                        width: 60,
                        total: contentLength
                    });
                    httpResponse.on('data', chunk => {
                        bar.tick(chunk.length);
                    });
                    let writable = fs.createWriteStream(savePath);
                    httpResponse.pipe(writable);
                    httpResponse.on('end', () => {
                        console.log('download complete');
                        cb(null, httpResponse.headers);
                    })
                }else {
                    httpResponse.setEncoding('utf8');
                    let errData = '';
                    httpResponse.on('data', chunk => {
                        errData += chunk;
                    });
                    httpResponse.on('end', () => {
                        cb(new Error(`download error, code is '${httpResponse.statusCode}'\n${errData}`));
                    })
                }

            });
            httpRequest.on('error', e => {
                if(cb){
                    cb(e);
                }
            });
            httpRequest.end();
        }catch (e){
            if(cb){
                cb(e);
            }
        }
    }
}

module.exports = HttpUtil;