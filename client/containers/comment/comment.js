/**
 * Created by Aaron on 2018/1/17.
 */
import './comment.scss'

/**
 * 提交一条评论
 */
$('#commitComment').click(function () {
    let movieID = $('#movieID').val();
    let content = $('#commentContent').val();
    let $commitComment = $(this);
    $.ajax({
        url: '/comment/commit',
        type: 'post',
        dataType: 'json',
        data: {'comment[movie]': movieID, 'comment[content]': content},
        global: false,
        beforeSend: function () {
            $commitComment.attr('disabled', true);
        },
        success: function (data) {
            alert(data.message);
            if(data.success){
                $('#commentContent').val('');
                addCommentToPage(data.result);
            }
            $commitComment.removeAttr('disabled');
        },
        error: function () {
            alert('评论失败');
            $commitComment.removeAttr('disabled');
        }
    });
});

/**
 * 显示一条评论信息在评论列表首部
 * @param comment 一条评论的对象
 */
function addCommentToPage(comment){
    console.log(comment);
}