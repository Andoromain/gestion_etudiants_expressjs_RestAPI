var express = require('express');
var app=express();

app.get('/',function(req,res){
  res.send("ok")
})

app.get('/user/:id',function(req,res,next){
  if(req.params.id==1) next('route');
  else next();  
},function(req,res,next){
  res.send("Parametre autre")
})
app.get('/user/:id',function(req,res,next){
  res.send("Parametre 1");
})
app.listen(8081)