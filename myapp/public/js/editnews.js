let newpic = null;
$('.newpic').on('change', function(){
    //上传logo
    let formData = new FormData($('.headerPhoto')[0]);
    let photoimg = $('.newpic').val();
    if(/\w\.(jpg|gif|png)$/i.test(photoimg)){
      $.ajax({
        url: '/api/admin/newpic',
        type: 'post',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
          if(data.status == 0){
            newpic = data.data.imgpath;
          }else{
            $('.modal-body').html(data.data.info);
            $('.layer').modal();
          }
        },
        error:function(err){
          console.log(err);
        }
      })
    }else{
      $('.modal-body').html('只支持jpg、gif、bmp、png、ttf、格式图片');
      $('.layer').modal();
    }
})

$('.editnews').click(function(){
  let id = $(this).attr('editid');
  let title = $('.title').val();
  let author = $('.author').val();
  let description = $('.description').val();
  let content = $('.content').val();
  let cid = $("#cid ").val();
  let status = $('input:radio:checked').val();
  $.ajax({
    type: 'post',
    url: '/api/admin/editnews',
    async: true,
    data:{id:id,title:title,author:author,description:description,content:content,cid:cid,status:status,newpic:newpic},
    dataType: 'json',
    success: function(data){
      if(data.status == 0){
        alert(data.data.info);
        window.location.href = '/admin/news';
      }else{
        alert(data.data.info);
      }
    },
    error: function(err){
      console.log(err);
    }
  })
})