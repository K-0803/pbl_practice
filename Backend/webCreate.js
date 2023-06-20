
var http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
// const router = require('../designDictionary/html/login.html');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../designDictionary')));
app.use(express.json());
app.use(express.static('designDictionary'));

app.get('/html/webCreate', function(req, res){
  const filePath = path.join('../designDictionary/html/webCreate.html');
  console.log(filePath);
  res.sendFile(filePath);

  res.end();
});

  app.post('/html/webCreate', function(req, res){

})
app.listen(8080, function(){
  console.log('サーバーがポート8080で起動しました。');
})