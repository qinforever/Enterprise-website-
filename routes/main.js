const express = require('express');
const router = express.Router();
const db = require('../common/db.js');
const async = require('async');


router.get('/',(req,res)=>{
  let url = req.url;
  async.parallel({
    nav:function(callback){
      db.find('nav',{},(err,data)=>{
        callback(err,data);
      })
    },
    partner:function(callback){
      db.find('facous',{"facous":"partner"},{"facousimg":1},(err,data)=>{
        callback(err,data);
      })
    },
    casecate:function(callback){
      db.find('casecate',{"recommend":"1"},(err,data)=>{
        callback(err,data);
      })
    },
    caserecommend:function(callback){
      db.find('case',{"cid":"59f1d531dc041629d071affd"},{"_id":1,"caseimage":1,"title":1},{page:1,pageSize:6},(err,data)=>{
        callback(err,data);
      });
    },
    newscate:function(callback){
      db.find('newscate',{"status":0},{},{page:1,pageSize:3},(err,data)=>{
        callback(err,data);
      })
    },
    newsone:function(callback){
      db.find('news',{"cid":"59f00d4d66368dddcf0ed14f"},{"_id":1,"title":1},{page:1,pageSize:6},(err,data)=>{
        callback(err,data);
      })
    },
    newstwo:function(callback){
      db.find('news',{"cid":"59f00d6866368dddcf0ed154"},{"_id":1,"title":1},{page:1,pageSize:6},(err,data)=>{
        callback(err,data);
      })
    },
    newsthree:function(callback){
      db.find('news',{"cid":"59f00d7a66368dddcf0ed15a"},{"_id":1,"title":1},{page:1,pageSize:6},(err,data)=>{
        callback(err,data);
      })
    }
  },function(err,result){
    result.url = url;
    res.render('main/index',result);
  })
})

router.get('/case',(req,res)=>{
  let url = req.url;
  async.parallel({
    nav:function(callback){
      db.find('nav',{},(err,data)=>{
        callback(err,data);
      })
    },
    catedata:function(callback){
      db.find('casecate',{},(err,data)=>{
        callback(err,data);
      })
    },
    caselist:function(callback){
      db.find('case',{},(err,data)=>{
        callback(err,data);
      })
    }
  },function(err,result){
    result.url = url;
    res.render('main/case',result);
  })
})

router.get('/news',(req,res)=>{
  let url = req.url;
  async.parallel({
    nav:function(callback){
      db.find('nav',{},(err,data)=>{
        callback(err,data);
      })
    }
  },function (err,result) {
      result.url = url;
      res.render('main/news',result);
    })
})

router.get('/about',(req,res)=>{
  let url = req.url;
  async.parallel({
    nav:function(callback){
      db.find('nav',{},(err,data)=>{
        callback(err,data);
      })
    },
    catedata:function(callback){
      db.find('casecate',{},(err,data)=>{
        callback(err,data);
      })
    },
    news:function(callback){
      db.find('news',{"_id":new db.ObjectID("59f6a1991eb67f1950193fe6")},{title:1,newpic:1,content:1},(err,data)=>{
        callback(err,data[0]);
      })
    },
    caslist:function(callback){
      db.find('case',{},{caseimage:1,title:1},(err,data)=>{
        callback(err,data);
      })
    }
  },function(err,result){
    result.url = url;
    res.render('main/about',result);
  })
})




module.exports = router;
