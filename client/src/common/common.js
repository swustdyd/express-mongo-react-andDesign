import React from 'react'
import { Select } from 'antd'
const {Option} = Select;

export default {
    getCurrentMenuKey: (props) => {
        let paths = [];
        let {href} = window.location;

        const index = href.indexOf('#/');
        href = href.substr(index + 1);
        paths = href.split('/');
        paths.splice(0, 1);

        const level = props.level - 1;
        const currentKey = paths[level] ? paths[level] : props.defaultKeys[0];
        return currentKey;
    },
    createLanguageOptions: () => {
        const languages = ['英语', '国语', '俄语', '日语', '西班牙语', '粤语'];
        const options = [];
        languages.forEach((item, index) => {
            options.push(<Option value={item} key={index}>{item}</Option>)
        });
        return options;
    },
    createUserRoleOptions: () => {
        const userRoles = [
            {name: '普通用户', id: 0},
            {name: '管理员', id: 10},
            {name: '超级管理员', id: 50}
        ];
        const options = [];
        userRoles.forEach((item, index) => {
            options.push(<Option value={item.id} key={index}>{item.name}</Option>)
        });
        return options;
    },
    parseCondition: (condition = {}, type = 'url') => {
        let returnStr = '';
        if(type === 'url'){
            const conditionArray = [];
            for(const key in condition){
                if(condition[key] || condition[key] === 0){                    
                    conditionArray.push(`${key}=${condition[key]}`);
                }
            }
            returnStr = conditionArray.join('&');
        }
        if(type === 'json'){
            returnStr = JSON.stringify(condition);
        }
        return returnStr;
    },
    parseUrl: (url: string) : {url: string, scheme: string, slash: string, host: string, port: string, path: string, query: string, hash: string} => {
        const reg = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
        const names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
        const result = reg.exec(url);
        if(result){
            const res = {};
            for(let i = 0; i < names.length;i++){
                res[names[i]] = result[i];
            }
            return res;
        }else {
            return null;
        }
    }
}

