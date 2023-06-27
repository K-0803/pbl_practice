
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../designDictionary')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../designDictionary/html/views'));

app.get('/register', function(req, res) {
  res.render('register', { mail: "", pass: "" , repass: "" }); 
});

app.post('/register', function(req, res) {
  const { email, pass, name ,boolean1 , boolean2} = req.body;
  console.log(email);
  console.log(pass);
  console.log(name);
  console.log(boolean1);
  console.log(boolean2);
  InsData(email, pass, name)
    .then(function(redUrl) {
      console.log('値は=' + redUrl);
      if (redUrl === '/redirect') {
        res.redirect(req.baseUrl + '/login.html');
      } else {
        res.render('register'); 
      }
    })
    .catch((error) => {

    const inputerr = {
       mail: error.code,
       pass: boolean1,
       repass: boolean2
    };
      
      if(error.code==23505){
        console.error(error.code);
      res.render('register', inputerr);
      }
    });
});

app.listen(8080, function() {
  console.log('サーバーがポート8080で起動しました。');
});

function InsData(email, pass, name) {
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
          text: 'INSERT INTO user_info (user_name, pwd, address) VALUES ($3, $2, $1);',
          values: [email, pass, name],
        };
        return client.query(query);
      })
      .then(function(res) {
        resultCnt = res.rowCount; 
        redct = '/redirect';
        console.log(redct);
        client.end();
        resolve(redct);
      })
      .catch(function(e) {
        console.log('SQLerror');
        console.error(e.stack);
        reject(e);
      });
  });
}
