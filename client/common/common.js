//import $ from 'jquery'
//window.jQuery = window.$ = $;
//import 'bootstrap-loader/lib/bootstrap.loader?extractStyles&configFilePath=../../../bootstraprc!bootstrap-loader/no-op.js'
import './common.scss'

window.alertTip = function (params) {
    let type = typeof params;
    switch (type.toLowerCase()){
        case 'string':
            alert(params);
            break;
        default:
            alert(params);
    }
};

/*$(document).ajaxError(function (event, xhr, options, exc) {
    let errorData = xhr.responseJson;
    if(!errorData){
        errorData = JSON.parse(xhr.responseText);
    }
    alertTip("errorMessage: " + errorData.message);
});*/

/*;(function ($) {
    $.fn.extend({
        "jsonSerialize": function () {
            let obj = {};
            $(this).find("*").each(function () {
                if($(this).attr("name")){
                    let value = getElementValue(this);
                    if(value){
                        obj[$(this).attr("name")] = value;
                    }
                }
            });
            return obj;
        }
    });

    function getElementValue(_this) {
        let value;
        let tagName = String($(_this)[0].tagName).toLowerCase();
        switch (tagName){
            case "input"://序列化input元素
                let type = $(_this).attr("type");
                if(type == "radio" || type == "checkbox"){
                    value = $(_this).is(":checked") ? $(_this).val() : false;
                }else{
                    value = $(_this).val();
                }
                return value;
            default:
                value = $(_this).val();
                return value;
        }
    }
})($);*/

/*//用户登录
$('.signin').click(function () {
    let name = $('#signinName').val().trim();
    let password = $('#signinPassword').val().trim();
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
$('.signup').click(function () {
    let name = $('#signupName').val().trim();
    let password = $('#signupPassword').val().trim();
    let confirmPassword = $('#confirmPassword').val().trim();
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
    let originPwd = $('#originPwd').val().trim();
    let newPwd = $('#newPwd').val().trim();
    let confirmPassword = $('#confirmUpPassword').val().trim();
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
});*/

