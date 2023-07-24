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

router.get('/', (req, res) => {
  const cookieHeader = req.headers.cookie;
  var data={
    acc: {name:'',gmail:'',account:'log in',log:'<a href="/login" class="login">'}
  }

  if (cookieHeader) {
    const cookiePairs = cookieHeader.split(';');
    const cookieData = {};
    
    for (const cookiePair of cookiePairs) {
      const [name, value] = cookiePair.trim().split('=');
      cookieData[name] = decodeURIComponent(value);
    }
    const userid = cookieData['userId'];
    const username = cookieData['userName'];

    console.log(username);
    
      InsData(userid)
      .then(function(mailid){
        let address = mailid;
        var data={
          acc: {name:username,gmail:address,account:'log out',log:'<a href="#logout" class="logout">'}
        }
        res.render('mypage',data);
      }).catch(function(e){
        console.log(e);
      })    
  }else{
    res.render('mypage',data)
  }

   
});

function InsData(userid) {
  // postgres接続
  const { Client } = require('pg');
  const client = new Client({
    user: 'postgres', // ユーザー名
    host: 'database-2.cgz0heptpctb.us-east-1.rds.amazonaws.com', // ホスト
    database: 'postgres', // DB名
    password: 'shirokuma123', // ユーザーパスワード
    port: 5432,
  });

  // データベース追加
  return new Promise(function(resolve, reject) {
    client
      .connect()
      .then(function() {
        const query = {
          text: 'SELECT address FROM user_info WHERE user_id = $1;',
          values: [userid],
        };
        return client.query(query);
      })
      .then(function(res) {
      console.log(res.rows[0].address);
        let gmail = res.rows[0].address; 
        client.end();
        resolve(gmail);
      })
      .catch(function(e) {
        console.log('SQLerror');
        console.error(e.stack);
        reject(e);
      });
  });
}


module.exports =router;