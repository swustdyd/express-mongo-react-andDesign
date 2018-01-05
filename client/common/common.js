window.jQuery = window.$ = require('jquery');
require('bootstrap-loader/lib/bootstrap.loader?extractStyles&configFilePath=../../../bootstraprc!bootstrap-loader/no-op.js');
require('./common.scss');

window.alertTip = function (params) {
    var type = typeof params;
    switch (type.toLowerCase()){
        case 'string':
            alert(params);
            break;
        default:
            alert(params);
    }
};

