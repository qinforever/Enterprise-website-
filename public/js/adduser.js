let photo = null;
$('.face').on('change', function(){
    //上传logo
    let formData = new FormData($('.headerPhoto')[0]);
    let photoimg = $('.face').val();
    if(/\w\.(jpg|gif|png)$/i.test(photoimg)){
      $.ajax({
        url: '/api/admin/updataPhoto',
        type: 'post',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
          if(data.status == 0){
            $('.photoimg').attr('src',data.data.imgpath);
            photo = data.data.imgpath;
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
//添加学员
$('.adduser').click(function(){
  let username = $('.username').val();
  let password = $('.password').val();
  let password1 = $('.password1').val();
  let status = $('input:radio:checked').val();
  if(username!='' && password!='' && password===password1 && status!=''){
    $.ajax({
      type: 'post',
      url: '/api/admin/adduser',
      async: true,
      data: {
        username:username,
        password:password,
        password1:password1,
        status:status,
        photo:photo
      },
      dataType: 'json',
      success: function(data){
        console.log(data);
        if(data.status==0){
          alert('添加成功');
          setTimeout(function() {
            window.location.href = '/admin/userlist'
          }, 1000);
        }else{
          alert(data.data.info);
        }
      },
      error: function(err){
        console.log(err);
      }
    })
  }else{
    alert('请检查填写信息');
  }
})

//删除
$('.delete').click(function(){
  let del=confirm("确定删除吗？");
  if (del==true){
    $.get('/api/admin/deleteuser',{deleteid:$(this).attr('deleteid')},function(data){
      if(data.status == 0){
        alert('删除成功');
        window.location.reload();
      }else{
        alert('删除失败');
      }
    })
  }
})

//搜索
$('.usersearch').click(function(){
  var keyword = $('.userkey').val();
  window.location.href = '?keyword='+keyword;
})