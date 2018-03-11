import React from 'react'
import { message } from 'antd'
import Promise from 'promise'

export default {
    getHashPath : (href) => {
        let paths = [];
        if(href){
            let index = href.indexOf('#/');
            href = href.substr(index + 1);
            paths = href.split('/');
            paths.splice(0, 1);
        }
        return paths;
    },
    /*customFetch: (path, option) => {
        if((typeof path) !== 'string'){
            throw 'path is must be set in first param';
        }
        let errRes;
        return new Promise(function(resolve, reject){
            fetch(path, option)
                .then(res => {
                    if(res.status >= 200 && res.status < 400){
                        resolve(res);
                    }else{
                        errRes = res;
                        return res.json();
                    }
                })
                .then(err => {
                    message.error(err.message);
                    if(err.errorCode === 1){
                        /!*console.log('need login')
                        ModalAction.showModal({
                            title: '登录',
                            maskClosable: true,
                            modalContent: <Login onLoginSuccess={ModalAction.hideModal()}/>
                        });*!/
                    }
                })
                .catch((e) => {
                    console.log(e)
                    console.log(errRes);
                    message.error('请求错误，服务器返回的错误信息不是json格式');
                });
        });

    }*/
}

