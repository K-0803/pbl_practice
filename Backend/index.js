const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const router = express.Router();
const path = require('path');

app.use(express.static('public'));
app.use(cookieParser());

//ejsルート
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../designDictionary/html/views'));

// ホームページの表示
router.get('/', async(req, res) => {  
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
      const cookiePairs = cookieHeader.split(';');
      const cookieData = {};
      
      for (const cookiePair of cookiePairs) {
        const [name, value] = cookiePair.trim().split('=');
        cookieData[name] = decodeURIComponent(value);
      }

      const username = cookieData['userName'];
      res.render('index',{acc:username});
    }else{
      res.render('index',{acc:''});
    }
});


module.exports =router;