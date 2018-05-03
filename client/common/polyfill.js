/**
 * Created by Aaron on 2018/4/2.
 */
import 'babel-polyfill';
import 'fetch-polyfill';

String.prototype.endWith = function(str) {
    let reg = new RegExp(str + '$');
    return reg.test(this);
}

String.prototype.startsWith = function(str) {
    let reg = new RegExp(str + '^');
    return reg.test(this);
}

if (!window.location.origin) {
    window.location.origin = window.location.protocol
        + '//' + window.location.hostname
        + (window.location.port ? ':' + window.location.port : '');
}
