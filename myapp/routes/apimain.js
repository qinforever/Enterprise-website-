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

//轮播图请求接口
router.get('/facous',(req,res)=>{
  db.find('facous',{"facous":"facous"},{"facousimg":1},(err,data)=>{
    if(!err){
      res.json({
        "msg": 'ok',
        "status": 0,
        "data": data
      });
    }
  })
})
//首页获取行业分类图片
router.get('/industrycase',(req,res)=>{
  let id = req.query.id;
  db.find('case',{'cid':id},{'_di':1,"caseimage":1,"title":1},{page:1,pageSize:6},(err,data)=>{
    if(!err){
      res.json({
        "msg": "ok",
        "status": 0,
        "data": data
      })
    }else{
      res.send('查询错误');
    }
  })
})


module.exports = router;
