const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const router = express.Router();
const path = require('path');

app.use(express.static('public'));
app.use(cookieParser());

// ホームページの表示
router.get('/', (req, res) => {
  const cookies = req.headers.cookie;
  const filePath = path.join(__dirname,'../designDictionary' ,'html','mypage.html');
  console.log(cookies);
  res.sendFile(filePath);
});


module.exports =router;