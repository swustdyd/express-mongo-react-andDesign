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
    }
}

