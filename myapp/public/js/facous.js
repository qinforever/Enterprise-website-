let facousimg = null;
$('.facouspic').on('change', function(){
    //上传logo
    let formData = new FormData($('.headerPhoto')[0]);
    let photoimg = $('.facouspic').val();
    if(/\w\.(jpg|gif|png)$/i.test(photoimg)){
      $.ajax({
        url: '/api/admin/facouspic',
        type: 'post',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
          if(data.status == 0){
            facousimg = data.data.imgpath;
            $('.caseimg').attr('src',facousimg);
          }else{
            alert(data.data.info);
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


$('.addfacous').click(function(){
  let title = $('.facoustit').val();
  let facous = $('.facous').val();
  let status = $('input:radio[name="status"]:checked').val();
  $.ajax({
    type: 'post',
    url: '/api/admin/addfacous',
    data: {title:title,status:status,facousimg:facousimg,facous:facous},
    dataType: 'json',
    success: function(data){
      if(data.status == 0){
        alert(data.data.info);
        window.location.href = '/admin/facous';
      }else{
        alert(data.data.info);
      }
    }
  })
})

$('.facousdel').click(function(){
  let del=confirm("确定删除吗？");
  let id = $(this).attr('deleteid');
  if (del==true){
    $.get('/api/admin/facousdel',{id:id},function(data){
      if(data.status == 0){
        alert('删除成功');
        window.location.reload();
      }else{
        alert('删除失败');
      }
    })
  }
})


$('.addparther').click(function(){
  let title = $('.parthertit').val();
  let facous = $('.facous').val();
  let status = $('input:radio[name="status"]:checked').val();
  $.ajax({
    type: 'post',
    url: '/api/admin/addparther',
    data: {title:title,status:status,facousimg:facousimg,facous:facous},
    dataType: 'json',
    success: function(data){
      if(data.status == 0){
        alert(data.data.info);
        window.location.href = '/admin/facous';
      }else{
        alert(data.data.info);
      }
    }
  })
})
