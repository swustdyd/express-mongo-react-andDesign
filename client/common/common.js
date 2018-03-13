import React from 'react'
import { message } from 'antd'
import Promise from 'promise'

export default {
    getCurrentMenuKey: (props) => {
        let paths = [];
        let href = window.location.href;

        let index = href.indexOf('#/');
        href = href.substr(index + 1);
        paths = href.split('/');
        paths.splice(0, 1);

        let level = props.level - 1;
        let currentKey = paths[level] ? paths[level] : props.defaultKeys[0];
        return currentKey;
    }
}

