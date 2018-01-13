/**
 * Created by Aaron on 2018/1/9.
 */
var colors = require('colors');

colors.setTheme({
    warn: 'yellow',
    debug: 'green',
    error: 'red',
    info: 'white'
});

module.exports = {
    _currentLevel: 'info',
    _levelData: {
        info:  1,
        debug: 2,
        warn:  3,
        error: 4
    },
    _print: function (message, type) {
        type = type || 'info';
        this._currentLevel = this._currentLevel || 'info';
        if(this._levelData[type] < this._levelData[this._currentLevel]){
            return;
        }
        if (message instanceof Error) {
            var msg = message.message;
            var stack = message.stack;
            if (type) {
                console.log(msg[type]);
                console.log(stack[type]);
            }
        } else {
            console.log(message[type]);
        }
    },
    info: function (message) {
        this._print(message, 'info');
    },
    debug: function (message) {
        this._print(message, 'debug')
    },
    warning: function (message) {
        this._print(message, 'warn')
    },
    error: function (message) {
        this._print(message, 'error')
    }
};