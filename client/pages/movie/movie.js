/**
 * Created by Aaron on 2018/1/4.
 */
require('../../common/common');
/**
 * 删除一项数据
 */
$('.del').click(function () {
    var id = $(this).attr('data-id');
    var _this = this;
    $.ajax({
        url: '/admin/movie/delete',
        data: {'id': id},
        success: function (data) {
            alertTip(data.message);
            if(data.success){
                $('tr.item-id-' + id).remove();
            }
        }
    });
});