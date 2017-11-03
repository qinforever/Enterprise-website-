const express = require('express');
const path = require('path');
//cookie 存储
const cookieParser = require('cookie-parser');
//处理post 请求
const bodyParser = require('body-parser');
//加密
const md5 = require('md5');
const app = express();
//模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//数据库处理
const db=require('./common/db.js');
//默认路径
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public',express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));
//路由请求模块
app.use('/',require('./routes/main.js'));
app.use('/admin', require('./routes/admin.js'));
app.use('/api/main',require('./routes/apimain.js'));
app.use('/api/admin',require('./routes/apiadmin.js'));















app.listen(3000,'120.78.194.104',(err)=>{
  if(!err){
    console.log('server run 127.0.0.1:3000');
  }else{
    console.log('链接失败');
  }
})
