/**
 * Created by Aaron on 2018/1/9.
 */
const colors = require('colors');

colors.setTheme({
    warn: 'yellow',
    debug: 'green',
    error: 'red',
    info: 'white'
});

let _currentLevel = 'info';
const _levelData = {
    info:  1,
    debug: 2,
    warn:  3,
    error: 4
};

const _print = (type, ...args) => {
    type = type || 'info';
    _currentLevel = _currentLevel || 'info';
    if(_levelData[type] < _levelData[_currentLevel]){
        return;
    }
    args.forEach(item => {
        if (item instanceof Error) {
            let msg = item.message;
            let stack = item.stack;
            if (type) {
                console.log(msg[type], stack[type]);
            }
        } else{
            console.log(('Logger ' + type + '：' + JSON.stringify(item))[type]);
        }
    });
};

const info = (...args) => {
    _print('info', ...args);
};
const debug = (...args) => {
    _print('debug', ...args)
};
const warning = (...args) => {
    _print('warn', ...args)
};
const error =  (...args) => {
    _print('error', ...args)
};

module.exports = {
    info,
    debug,
    warning,
    error
};