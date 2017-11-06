$('.addnav').click(function(){
  let navtitle = $('.addnavtitle').val();
  let link = $('.link').val();
  let status = $('input:radio[name="status"]:checked').val();
  $.post('/api/admin/addnav',{navtitle,status,link},function(data){
    if(data.status == 0){
      alert(data.data.info);
      window.location.href = '/admin/nav';
    }else{
      alert(data.data.info);
    }
  })
})

$('.navdelete').click(function(){
  let del=confirm("确定删除吗？");
  if (del==true){
    $.get('/api/admin/navdelete',{deleteid:$(this).attr('deleteid')},function(data){
      if(data.status == 0){
        alert('删除成功');
        window.location.reload();
      }else{
        alert('删除失败');
      }
    })
  }
})