/**
 * Created by Aaron on 2018/1/4.
 */
require('../../common/common');
require("../comment/comment");

/**
 * 删除一项数据
 */
$('.del').click(function () {
    var id = $(this).attr('data-id');
    var _this = this;
    $.ajax({
        url: '/movie/delete',
        data: {'id': id},
        success: function (data) {
            alertTip(data.message);
            if(data.success){
                $('tr.item-id-' + id).remove();
            }
        }
    });
});

/**
 * 提交电影信息
 */
$('#commitMovie').click(function () {
    var movieData = $('#movieForm').jsonSerialize();
    $.ajax({
        url: '/movie/newOrUpdate',
        type: 'post',
        dataType: 'json',
        data: movieData,
        success: function (data) {
            alert(data.message);
            if(data.success){
                location.href = '/movie/list.html'
            }
        }
    });
});