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

//用户登录
$('#signinAction').click(function () {
   var name = $('#signinName').val().trim();
   var password = $('#signinPassword').val().trim();
   if(!name){
       alertTip('用户名不能为空');
       return;
   }
    if(!password){
        alertTip('密码不能为空');
        return;
    }
    $.ajax({
        url: '/user/signin',
        type: 'post',
        data: {'user[name]': name, 'user[password]': password},
        success: function (data) {
            alertTip(data.message);
            if(data.success){
                window.location.reload();
            }
        }
    })
});

//用户注册
$('#signupAction').click(function () {
    var name = $('#signupName').val().trim();
    var password = $('#signupPassword').val().trim();
    var confirmPassword = $('#confirmPassword').val().trim();
    if(!name){
        alertTip('用户名不能为空！');
        return;
    }
    if(!password){
        alertTip('密码不能为空！');
        return;
    }
    if(!confirmPassword){
        alertTip('确认密码不能为空！');
        return;
    }
    if(confirmPassword !== password){
        alertTip('密码不一致！');
        return;
    }
    $.ajax({
        url: '/user/signup',
        type: 'post',
        data: {'user[name]': name, 'user[password]': password},
        success: function (data) {
            alertTip(data.message);
            if(data.success){
                $('#signupModal').modal('hide');
            }
        }
    })
});

