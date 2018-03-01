/**
 * Created by Aaron on 2018/1/4.
 */
import '../../common/common'
//import '../comment/comment'

import React from 'react'
import ReactDom from 'react-dom'
import CustomLayout from '../layout'

ReactDom.render(
    <CustomLayout defaultSelectedKeys={['2']}>

    </CustomLayout>,
    document.getElementById('app')
);
/*
/!**
 * 删除一项数据
 *!/
$('.del').click(function () {
    let id = $(this).attr('data-id');
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

/!**
 * 提交电影信息
 *!/
$('#commitMovie').click(function () {
    let movieData = $('#movieForm').jsonSerialize();
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
});*/
