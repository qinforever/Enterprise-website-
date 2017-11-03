const express = require('express');
const router = express.Router();
//数据库处理
const db = require('../common/db.js');
//登陆判断
const session = require('express-session');
//async
const async = require('async');
//公式
router.use(session({
  secret: 'keyboard cat',  // sign the session ID cookie. 加密方式
  resave: false,  //无论有没有修改session 都保存
  saveUninitialized: true,  //当未初始化的时候也保存session
  //cookie: { secure: true }  //和刚才讲的cookie一样  secure: 应用在https
}))

//判断权限
router.use((req,res,next)=>{
    if(req.session.userinfo && req.session.userinfo.username!=''){
        next();
    }else {
        //console.log(req.url);  // /login
        if (req.url == '/login' || req.url == '/api/admin/login') {
            next();
        }else {
            //res.redirect('/admin/login');
            next();
            /*跳转到登录页面*/
        }
    }
})


router.get('/', (req, res)=>{
  res.render('admin/index/index');
});

router.get('/userlist', (req, res)=>{
  let keyword = req.query.keyword;
  let page = req.query.page || 1;
  let pageSize = 10;
  let json = keyword?{"username":{$regex:new RegExp(keyword)}}:{};
  async.parallel({
    count: function (callback) {
        db.count('user',{},function(err,countNum){
            callback(err,countNum);
        })
    },
    list: function (callback) {
        db.find('user',json,{},{
            page:page,
            pageSize:pageSize
        },function(err,data){
            callback(err,data)
        })
    }
  }, function(err, results){
      if(!err){
        res.render('admin/userlist/index',{
            data:results.list,
            keyword:keyword,
            page:page,
            totalPage:Math.ceil(results.count/pageSize)
        })
      }else{
        console.log(err);
      }
  })
});


router.get('/add', (req, res)=>{
  res.render('admin/add/index');
});

router.get('/login',(req,res)=>{
  res.render('admin/login/index');
})

router.get('/news',(req,res)=>{
  let keyword = req.query.keyword;
  let json = keyword?{"title":{$regex:new RegExp(keyword)}}:{};
  db.find('news',json,(err,data)=>{
    db.find('newscate',{},(err,newscate)=>{
      if(!err){
        res.render('admin/news/index',{
          data:data,
          keyword:keyword,
          newscate:newscate
        });
      }else{
        res.send('not found');
      }
    })
  })
})

router.get('/newscate',(req,res)=>{
  db.find('newscate',{},(err,data)=>{
    if(!err){
      res.render('admin/newscate/index',{
        data:data
      });
    }else{
      res.send('not found');
    }
  })
})


router.get('/addnews',(req,res)=>{
  db.find('newscate',{},(err,data)=>{
    if(!err){
      res.render('admin/news/addnews',{
        data:data
      });
    }else{
      res.send('not found');
    }
  })
})

router.get('/editnews',(req,res)=>{
  let id = req.query.editid;
  db.find('newscate',{},(err,catedata)=>{
    db.find('news',{'_id':new db.ObjectID(id)},(err,data)=>{
      if(!err){
        res.render('admin/news/editnews',{
          data:data[0],
          catedata:catedata
        });
      }
    })
  })
})

router.get('/case',(req,res)=>{
  db.find('case',{},(err,data)=>{
    res.render('admin/case/index',{
      data:data
    });
  
  })
})

router.get('/addcase',(req,res)=>{
  db.find('casecate',{},(err,data)=>{
    if(!err){
      res.render('admin/case/addcase',{
        data:data
      });
    }else{
      res.send('分类查询失败');
    }
  })  
})


router.get('/catecase',(req,res)=>{
  db.find('casecate',{},(err,data)=>{
    res.render('admin/case/catecase',{
      data:data
    });
  })
})

router.get('/addcatecase',(req,res)=>{
  res.render('admin/case/addcatecase');
})

router.get('/editcatecase',(req,res)=>{
  let id = req.query.id;
  db.find('casecate',{'_id':new db.ObjectID(id)},(err,data)=>{
    if(!err){
      res.render('admin/case/editcatecase',{
        data:data[0]
      });
    }
  })
})

router.get('/nav',(req,res)=>{
  db.find('nav',{},(err,data)=>{
    if(!err){
      res.render('admin/index/nav',{
        data:data
      });
    }else{
      res.send('导航查询失败');
    }
  })
})


router.get('/addnav',(req,res)=>{
  res.render('admin/index/addnav');
})

router.get('/facous',(req,res)=>{
  let page = req.query.page || 1;
  let pageSize = 10;
  async.parallel({
    count: function (callback) {
      db.count('facous',{},function(err,data){
          callback(err,data);
      })
    },
    facous: function(callback){
      db.find('facous',{},{},{page,pageSize},(err,data)=>{  
        callback(err,data);
      })
    }
  },function(err,results){
    if(!err){
      res.render('admin/facous/facous',{
        data:results.facous,
        page:page,
        totalPage:Math.ceil(results.count/pageSize)
      })
    }
  })
})

router.get('/addfacous',(req,res)=>{
  res.render('admin/facous/addfacous');
})

router.get('/addpartner',(req,res)=>{
  res.render('admin/facous/addpartner');
})











module.exports = router;
