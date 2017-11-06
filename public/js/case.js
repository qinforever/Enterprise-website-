$('.addcatecase').click(function(){
  let catecasetitle = $('.addcatetitle').val();
  let recommend = $('input:radio[name="recommend"]:checked').val();
  let status = $('input:radio[name="status"]:checked').val();
  $.post('/api/admin/addcatecase',{catecasetitle,status,recommend},function(data){
    if(data.status == 0){
      alert(data.data.info);
      window.location.href = '/admin/catecase';
    }else{
      alert(data.data.info);
    }
  })
})


$('.delcasecate').click(function(){
  let del=confirm("确定删除吗？");
  if (del==true){
    $.get('/api/admin/delcasecate',{deleteid:$(this).attr('catedelete')},function(data){
      if(data.status == 0){
        alert('删除成功');
        window.location.reload();
      }else{
        alert('删除失败');
      }
    })
  }
})

let caseimage = null;
$('.casepic').on('change', function(){
    //上传logo
    let formData = new FormData($('.headerPhoto')[0]);
    let photoimg = $('.casepic').val();
    if(/\w\.(jpg|gif|png)$/i.test(photoimg)){
      $.ajax({
        url: '/api/admin/casepic',
        type: 'post',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
          console.log(data);
          if(data.status == 0){
            caseimage = data.data.imgpath;
            $('.caseimg').attr('src',caseimage);
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

$('.addcase').click(function(){
  let title = $('.title').val();
  let description = $('.description').val();
  let content = $('.content').val();
  let cid = $("#cid ").val();
  let status = $('input:radio[name="status"]:checked').val();
  $.ajax({
    type: 'post',
    url: '/api/admin/addcase',
    async: true,
    data:{title:title,description:description,cid:cid,status:status,caseimage:caseimage},
    dataType: 'json',
    success: function(data){
      if(data.status == 0){
        alert(data.data.info);
        window.location.href = '/admin/case';
      }else{
        alert(data.data.info);
      }
    },
    error: function(err){
      console.log(err);
    }
  })
})


$('.casedelete').click(function(){
  let del=confirm("确定删除吗？");
  if (del==true){
    $.get('/api/admin/casedelete',{deleteid:$(this).attr('deleteid')},function(data){
      if(data.status == 0){
        alert('删除成功');
        window.location.reload();
      }else{
        alert('删除失败');
      }
    })
  }
})


$('.editcatecase').click(function(){
  let id = $('.editcatecase').attr('editcaseid');
  let catecasetitle = $('.addcatetitle').val();
  let recommend = $('input:radio[name="recommend"]:checked').val();
  let status = $('input:radio[name="status"]:checked').val();
  $.post('/api/admin/editcatecase',{catecasetitle,status,recommend,id},function(data){
    if(data.status == 0){
      alert(data.data.info);
      window.location.href = '/admin/catecase';
    }else{
      alert(data.data.info);
    }
  })
})