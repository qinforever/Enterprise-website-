const express = require('express');
const router = express.Router();
//图片上传
const multiparty = require('multiparty');
//处理post 请求
const bodyParser = require('body-parser');
//数据库处理
const db = require('../common/db.js');
//登陆存储
const session = require('express-session');
//公式
router.use(session({
  secret: 'keyboard cat',  // sign the session ID cookie. 加密方式
  resave: false,  //无论有没有修改session 都保存
  saveUninitialized: true,  //当未初始化的时候也保存session
  //cookie: { secure: true }  //和刚才讲的cookie一样  secure: 应用在https
}))
//返回状态
let responseData = {
  msg: 'ok',
  status: 0,
  data: {}
}

//图片处理
router.post('/updataPhoto', (req, res) => {
  let form = new multiparty.Form();
  form.uploadDir = './public/upload/';
  form.parse(req, function (error, fields, files) {
    if (error) {
      responseData.status = 1;
      responseData.data.info = '上传失败';
      res.send(responseData);
    }
    //成功
    let logoObj = files.face[0];
    //修改图片名称，改回原来名字
    //fs.renameSync(logoObj.path, 'images/logo/'+logoObj.originalFilename);
    //判断上传是否为图片格式
    if (/\w\.(jpg|gif|png|jpeg)$/i.test(logoObj.path)) {
      responseData.status = 0;
      responseData.data.info = '上传成功';
      responseData.data.imgpath = '\\' + logoObj.path;
    } else {
      responseData.status = 2;
      responseData.data.info = '只支持jpg、gif、bmp、png、ttf、格式图片';
    }
    res.send(responseData);
  })
})

//接收添加用户
router.post('/adduser',(req,res)=>{
  let username = req.body.username;
  db.find('user',{username:username},(err,data)=>{
    if(data.length<1){
      db.insert('user',req.body,(err,data)=>{
        if(!err){
          responseData.status = 0;
          responseData.data.info = '添加成功';
        }else{
          responseData.status = 2;
          responseData.data.info = '添加失败';
        }
        res.send(responseData);
      }) 
    }else{
      responseData.status = 1;
      responseData.data.info = '该用户名已被使用，请更换!';
      res.send(responseData);
    }
  })
})

//登陆
router.post('/login',(req,res)=>{
  db.find('user',req.body,(err,data)=>{
    console.log(data);
    if(data.length>0){
      req.session.userinfo = data[0];
      responseData.status = 0;
      responseData.data = '登陆成功';
    }else{
      responseData.status = 1;
      responseData.data.info = '用户名或密码错误';
    }
    res.send(responseData);
  })
})

//退出登录
router.get('/loginout',(req,res)=>{
  req.session.userinfo = null;
  res.redirect('/admin/login');
})

//删除用户
router.get('/deleteuser',(req,res)=>{
  let id = req.query.deleteid;
  console.log(id);
  db.delete('user',{'_id':new db.ObjectID(id)},(err,data)=>{
    if(!err){
      responseData.status = 0;
      responseData.data.info = '删除成功';
    }else{
      responseData.status = 1;
      responseData.data.info = '删除失败';
    }
    res.send(responseData);
  })
})


router.post('/newpic', (req, res) => {
  let form = new multiparty.Form();
  form.uploadDir = './public/newpic/';
  form.parse(req, function (error, fields, files) {
    if (error) {
      responseData.status = 1;
      responseData.data.info = '上传失败';
      res.send(responseData);
    }
    //成功
    let logoObj = files.face[0];
    //修改图片名称，改回原来名字
    //fs.renameSync(logoObj.path, 'images/logo/'+logoObj.originalFilename);
    //判断上传是否为图片格式
    if (/\w\.(jpg|gif|png|jpeg)$/i.test(logoObj.path)) {
      responseData.status = 0;
      responseData.data.info = '上传成功';
      responseData.data.imgpath = '\\' + logoObj.path;
    } else {
      responseData.status = 2;
      responseData.data.info = '只支持jpg、gif、bmp、png、ttf、格式图片';
    }
    res.send(responseData);
  })
})

//新增新闻
router.post('/addnews',(req,res)=>{
  let title = req.body.title;
  let author = req.body.author;
  let description = req.body.description;
  let content = req.body.content;
  let status = req.body.status;
  let newpic = req.body.newpic;
  let cid = req.body.cid;
  db.find('newscate',{'_id':new db.ObjectID(cid)},(err,data)=>{
    let catename = data[0].title;
    db.insert('news',{title,author,description,content,status,newpic,cid,catename},(err,data)=>{
      if(!err){
        responseData.status = 0;
        responseData.data.info = '添加成功';
      }else{
        responseData.status = 1;
        responseData.data.info = '添加失败';
      }
      res.send(responseData);
    })
  })
})

//删除新闻
router.get('/deletenews',(req,res)=>{
  let id = req.query.deleteid;
  db.delete('news',{'_id':new db.ObjectID(id)},(err,data)=>{
    if(!err){
      responseData.status = 0;
      responseData.data.info = '删除成功';
    }else{
      responseData.status = 1;
      responseData.data.info = '删除失败';
    }
    res.send(responseData);
  })
})

//新闻内容添加
router.post('/uploadnews',(req,res)=>{
  let form = new multiparty.Form();
  form.uploadDir = './public/newpic/';
  form.parse(req, function (error, fields, files) {
    console.log(files);
  })
})

//修改内容
router.post('/editnews',(req,res)=>{
  let id = req.body.id;
  let title = req.body.title;
  let author = req.body.author;
  let description = req.body.description;
  let content = req.body.content;
  let cid = req.body.cid;
  let status = req.body.status;
  let newpic = req.body.newpic;
  //如果图片修改那么就更新，没有修改就不更新
  if(newpic){
    var json = {
      title,author,description,content,cid,status,newpic
    }
  }else{
    var json = {
      title,author,description,content,cid,status
    }
  }
  db.update('news',{'_id':new db.ObjectID(id)},json,(err,data)=>{
    if(!err){
      responseData.status = 0;
      responseData.data.info = '修改成功';
    }else{
      responseData.status = 1;
      responseData.data.info = '修改失败';
    }
    res.send(responseData);
  })
})
//案例分类添加
router.post('/addcatecase',(req,res)=>{
  db.insert('casecate',req.body,(err,data)=>{
    if(!err){
      responseData.status = 0;
      responseData.data.info = '添加成功';
    }else{
      responseData.status = 1;
      responseData.data.info = '添加失败';
    }
    res.send(responseData);
  })
})  
//案例分类删除
router.get('/delcasecate',(req,res)=>{
  let id = req.query.deleteid;
  db.delete('casecate',{'_id':new db.ObjectID(id)},(err,data)=>{
    if(!err){
      responseData.status = 0;
      responseData.data.info = '删除成功';
    }else{
      responseData.status = 1;
      responseData.data.info = '删除失败';
    }
    res.send(responseData);
  })
})
//案例封面图片
router.post('/casepic', (req, res) => {
  let form = new multiparty.Form();
  form.uploadDir = './public/images/';
  form.parse(req, function (error, fields, files) {
    if (error) {
      responseData.status = 1;
      responseData.data.info = '上传失败';
      res.send(responseData);
    }
    //成功
    let logoObj = files.casepic[0];
    //修改图片名称，改回原来名字
    //fs.renameSync(logoObj.path, 'images/logo/'+logoObj.originalFilename);
    //判断上传是否为图片格式
    if (/\w\.(jpg|gif|png|jpeg)$/i.test(logoObj.path)) {
      responseData.status = 0;
      responseData.data.info = '上传成功';
      responseData.data.imgpath = '\\' + logoObj.path;
    } else {
      responseData.status = 2;
      responseData.data.info = '只支持jpg、gif、bmp、png、ttf、格式图片';
    }
    res.send(responseData);
  })
})
//添加案例
router.post('/addcase',(req,res)=>{
  let cid = req.body.cid;
  let title = req.body.title;
  let description = req.body.description;
  let status = req.body.status;
  let caseimage = req.body.caseimage;
  db.find('casecate',{'_id':new db.ObjectID(cid)},(err,catedata)=>{
    let catename = catedata[0].catecasetitle;
    db.insert('case',{cid,title,description,status,caseimage,catename},(err,data)=>{
      if(!err){
        responseData.status = 0;
        responseData.data.info = '添加成功';
      }else{
        responseData.status = 1;
        responseData.data.info = '添加失败';
      }
      res.send(responseData);
    })
  })
})
//删除案例
router.get('/casedelete',(req,res)=>{
  let id = req.query.deleteid;
  db.delete('case',{'_id':new db.ObjectID(id)},(err,data)=>{
    if(!err){
      responseData.status = 0;
      responseData.data.info = '删除成功';
    }else{
      responseData.status = 1;
      responseData.data.info = '删除失败';
    }
    res.send(responseData);
  })
})
//案例分类修改
router.post('/editcatecase',(req,res)=>{
  let id = req.body.id;
  let catecasetitle = req.body.catecasetitle;
  let status = req.body.status;
  let recommend = req.body.recommend;
  db.update('casecate',{'_id':new db.ObjectID(id)},{catecasetitle,status,recommend},(err,data)=>{
    if(!err){
      responseData.status = 0;
      responseData.data.info = '修改成功';
    }else{
      responseData.status = 1;
      responseData.data.info = '修改失败';
    }
    res.send(responseData);
  })
})
//导航添加
router.post('/addnav',(req,res)=>{
  db.insert('nav',req.body,(err,data)=>{
    if(!err){
      responseData.status = 0;
      responseData.data.info = '添加成功';
    }else{
      responseData.status = 1;
      responseData.data.info = '添加失败';
    }
    res.send(responseData);
  })
})
//导航删除
router.get('/navdelete',(req,res)=>{
  let id = req.query.deleteid;
  db.delete('nav',{'_id':new db.ObjectID(id)},(err,data)=>{
    if(!err){
      responseData.status = 0;
      responseData.data.info = '删除成功';
    }else{
      responseData.status = 1;
      responseData.data.info = '删除失败';
    }
    res.send(responseData);
  })
})
//轮播图片上传
router.post('/facouspic', (req, res) => {
  let form = new multiparty.Form();
  form.uploadDir = './public/images/';
  form.parse(req, function (error, fields, files) {
    if (error) {
      responseData.status = 1;
      responseData.data.info = '上传失败';
      res.send(responseData);
    }
    //成功
    let logoObj = files.facouspic[0];
    //修改图片名称，改回原来名字
    //fs.renameSync(logoObj.path, 'images/logo/'+logoObj.originalFilename);
    //判断上传是否为图片格式
    if (/\w\.(jpg|gif|png|jpeg)$/i.test(logoObj.path)) {
      responseData.status = 0;
      responseData.data.info = '上传成功';
      responseData.data.imgpath = '\\' + logoObj.path;
    } else {
      responseData.status = 2;
      responseData.data.info = '只支持jpg、gif、bmp、png、ttf、格式图片';
    }
    res.send(responseData);
  })
})
//添加轮播图
router.post('/addfacous',(req,res)=>{
  db.insert('facous',req.body,(err,data)=>{
    if(!err){
      responseData.status = 0;
      responseData.data.info = '添加成功';
    }else{
      responseData.status = 1;
      responseData.data.info = '添加失败';
    }
    res.send(responseData);
  })
});
//轮播图删除
router.get('/facousdel',(req,res)=>{
  let id = req.query.id;
  db.delete('facous',{'_id':new db.ObjectID(id)},(err,data)=>{
    if(!err){
      responseData.status = 0;
      responseData.data.info = '删除成功';
    }else{
      responseData.status = 1;
      responseData.data.info = '删除失败';
    }
    res.send(responseData);
  })
})
//添加合作伙伴图片
router.post('/addparther',(req,res)=>{
  db.insert('facous',req.body,(err,data)=>{
    if(!err){
      responseData.status = 0;
      responseData.data.info = '添加成功';
    }else{
      responseData.status = 1;
      responseData.data.info = '添加失败';
    }
    res.send(responseData);
  })
});










module.exports = router;
