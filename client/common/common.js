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

$(document).ajaxError(function (event, xhr, options, exc) {
    var errorData = xhr.responseJson;
    if(!errorData){
        errorData = JSON.parse(xhr.responseText);
    }
    alertTip("errorMessage: " + errorData.message);
});

//用户登录
$('.signin').click(function () {
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
                window.location.href = window.location.origin;
            }
        }
    })
});

//用户注册
$('.signup').click(function () {
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

$('#updatePwd').click(function () {
    var originPwd = $('#originPwd').val().trim();
    var newPwd = $('#newPwd').val().trim();
    var confirmPassword = $('#confirmUpPassword').val().trim();
    if(!originPwd){
        alertTip('原密码不能为空！');
        return;
    }
    if(!newPwd){
        alertTip('新密码不能为空！');
        return;
    }
    if(!confirmPassword){
        alertTip('确认密码不能为空！');
        return;
    }
    if(confirmPassword !== newPwd){
        alertTip('密码不一致！');
        return;
    }
    $.ajax({
        url: '/user/updatePwd',
        type: 'post',
        data: {'originPwd': originPwd, 'newPwd': newPwd},
        success: function (data) {
            alertTip(data.message);
            if(data.success){
                $('#updatePwdModal').modal('hide');
            }
        }
    })
});

