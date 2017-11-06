$('.landfall').click(function(){
  let username = $('.username').val();
  let password = $('.password').val();

  if(username !='' && password != ''){
    $.ajax({
      type: 'post',
      url: '/api/admin/login',
      async: true,
      data: {
        username: username,
        password: password
      },
      dataType: 'json',
      success: function(data){
        if(data.status == 0){
          window.location.href = '/admin';
        }else{
          alert('用户名或密码错误');
        }
      },
      error: function(err){
        console.log(err);
      }
    })
  }else{
    alert('请输入完整信息');
  }
})