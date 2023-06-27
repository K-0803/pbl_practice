const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');   //相対パスを使用可能にする
const bodyParser = require('body-parser');  //req.bodyを使用できるようにする

var html = require('fs').readFileSync('../designDictionary/html/favorite.html');

//ミドルウェアの設定
app.use(bodyParser.urlencoded({ extended: false }));    //req.bodyを使用するためのミドルウェア
app.use(bodyParser.json());                             //
app.use(express.static(path.join('../designDictionary'))); 
app.use(express.json());
app.use(cookieParser());

app.get('/favorite', function(req, res){
    const filePath = path.join('../designDictionary/html/postDetails.html');
    console.log(filePath);
    res.sendFile(filePath);
    res.end();
})

app.post('/favorite', function(req, res){
    const userId = req.cookies.userId;
})