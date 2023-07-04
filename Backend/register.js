
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

let sql = "";
let value = "";
let passerr ="";
let repasserr ="";
let overlap = "true";
let code ="";
let passcheak ="true";

let inputerr ={
  mail: "",
  epass: "",
  erepass: ""
}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../designDictionary')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../designDictionary/html/views'));

app.get('/register', function(req, res) {
  res.render('register', inputerr); 
});

app.post('/register', function(req, res) {
  const { email, pass, name, repass } = req.body;
  console.log(email);
  console.log(pass);
  console.log(name);
  sql = 'SELECT address FROM user_info WHERE address = $1;';
  value = [email];
  

  InsData(sql, value)
    .then(function(truefalse) {
      passlap();
      if (truefalse === "true") {
        if (passcheak == "false") {
          sql ='INSERT INTO user_info (user_name, pwd, address) SELECT CAST($3 AS VARCHAR), CAST($2 AS VARCHAR), CAST($1 AS VARCHAR)  WHERE NOT EXISTS (SELECT 1 FROM user_info WHERE address = $1);';
          value = [email, pass, name];
          InsData(sql, value)
            .then(function(redUrl) {
              console.log('値は=' + redUrl);
              if (redUrl === '/redirect') {
                res.redirect(req.baseUrl + '/login.html');
                res.end();
              }
            }).catch((error) => {
              console.log(error);
            });
        } else if (passcheak == "true") {
          code="";
          inputerr = {
            mail: code,
            epass: passerr,
            erepass: repasserr,
          };
          res.render('register', inputerr);
        }
      } else if (truefalse === "false") {
        code = "重複しています";
        inputerr = {
          mail: code,
          epass: passerr,
          erepass: repasserr,
        };
        res.render('register', inputerr);
      }
      
    })
    .catch((error) => {
      console.log(error);
    });

  function passlap(){
  if (typeof repass === 'string' && typeof pass === 'string' && pass === repass) {
    if (pass.length === 0 && repass.length === 0) {
      passerr = "パスワードを入力してください";
      repasserr = "パスワードを入力してください";
      passcheak = "true";
    } else {
      passerr ="";
      repasserr ="";
      passcheak = "false";
    }
  } else if (pass.length === 0) {
    passerr = "パスワードを入力してください";
    repasserr ="";
    passcheak ="true";
  } else if (repass.length === 0) {
    repasserr = "パスワードを入力してください";
    passerr ="";
    passcheak = "true";
  } else {
    repasserr = "同じパスワードを入力してください";
    passerr = "同じパスワードを入力してください";
    passcheak = "true";
  }}
 return(sql,value,passerr,repasserr,overlap);
});


app.listen(8080, function() {
  console.log('サーバーがポート8080で起動しました。');
});

function InsData(sql, value) {
  // postgres接続
  const { Client } = require('pg');
  const client = new Client({
    user: 'postgres', // ユーザー名
    host: 'database-2.cgz0heptpctb.us-east-1.rds.amazonaws.com', // ホスト
    database: 'postgres', // DB名
    password: 'shirokuma123', // ユーザーパスワード
    port: 5432,
  });

console.log(sql);
console.log(value);

  // データベース追加
  return new Promise(function(resolve, reject) {
    client
      .connect()
      .then(function() {
        const query = {
          text: sql,
          values: value,
        };
        return client.query(query);
      })
      .then(function(res) {
      console.log(res.rows.length);
      if(passcheak=="true"&&res.rows.length == 0){
        redct = "true";
        client.end();
        console.log();
        resolve(redct);
      }else if(res.rows.length == 1){
        redct = "false";
        client.end();
        console.log();
        resolve(redct);
      }else if(passcheak=="false"&&res.rows.length == 0){
          redct = '/redirect';
          client.end();
          resolve(redct);
        }
      })
      .catch(function(e) {
        console.log('SQLerror');
        console.error(e.stack);
        reject(e);
      });
  });
}