const express = require('express');
const http = require('http');

const app = express();


// Node.jsファイル1
app.use('/search', require('./term'));
app.use('/termDictionary', require('./termDictionary'));
app.use('/', require('./index'));


const server = http.createServer(app);
server.listen(8080); // ポート番号は必要に応じて変更