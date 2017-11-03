const config = require('./config.js');

const  MongoClient=require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;   /*查找_id*/
const dburl =config.dburl;


//链接数据库方法
function _connect(){
  return new Promise((resolve,reject)=>{
    MongoClient.connect(dburl,(err,db)=>{
      if(!err){
        resolve(db)
      }else{
        reject(err);
      }
    })
  })
}
/*
* json1 条件
* json2  列数
* json3 配置信息
* */
//查找数据
exports.find=function(collectionName,json1,json2,json3,callback){
  if(arguments.length==3){
    var cb=json2;
    var col={};  /*查询的列*/
    var skip=0;
    var limit=0;
  }else if(arguments.length==4){
    var cb=json3;
    var col=json2;  /*查询的列*/
    var skip=0;
    var limit=0;
  }else if(arguments.length==5){
    var cb=callback;
    var col=json2;  /*查询的列*/
    var limit=json3.pageSize || 10;   /*如果pageSize 每页10条*/
    var skip=json3.page? (json3.page-1)*limit : 0;  /*page每页传显示第一页*/
  }else{
    console.log('传入参数错误');
    return;
  }
  _connect().then((db)=>{
    let result = db.collection(collectionName).find(json1,col).skip(skip).limit(limit);
    result.toArray((err,data)=>{
      db.close();
      //callback 是一个形参，调用时候传过来
      cb(err,data);
    })
  })
}
//增加数据
exports.insert=function(collectionName,json,callback){
  _connect().then((db)=>{
    db.collection(collectionName).insertOne(json,(err,result)=>{
      db.close();
      callback(err,result);
    })
  })
}
//封装删除的方法
exports.delete=function(collectionName,json,callback){
  _connect().then((db)=>{
    db.collection(collectionName).deleteOne(json,(err,result)=>{
      db.close();
      callback(err,result);
    })
  })
}
//更新数据的方法
exports.update=function(collectionName,json1,json2,callback){
  _connect().then((db)=>{
    db.collection(collectionName).updateOne(json1,{
      $set:json2
    },(err,result)=>{
      db.close();
      callback(err,result);
    })
  })
}
//查找数据长度
exports.count=function(collectionName,json,callback){
  _connect().then((db)=>{
    db.collection(collectionName).count(json,(err,result)=>{
      db.close();
      callback(err,result);
    })
  })
}
















exports.ObjectID = ObjectID;