const { check, validationResult } = require('express-validator');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Console } = require('console');
const app = express();

const registrationValidationRules = [
  check('name')
    .not().isEmpty().withMessage('この項目は必須入力です。'),
  check('email')
    .not().isEmpty().withMessage('この項目は必須入力です。')
    .isEmail().withMessage('有効なメールアドレス形式で指定してください。'),
  check('password')
    .not().isEmpty().withMessage('この項目は必須入力です。')
    .isLength({ min:8, max:25 }).withMessage('8文字から25文字にしてください。')
    .custom((value, { req }) => {

      if(req.body.password !== req.body.passwordConfirmation) {

        throw new Error('パスワード（確認）と一致しません。');

      }

      return true;

    })
];

let inputerr ={
  name: "",
  mail: "",
  epass: "",
  erepass: ""
} 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../designDictionary')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../designDictionary/html/views'));

app.get('/otamesi',  (req, res) => {
  return res.render('otamesi'); 
});
app.post('/otamesi',registrationValidationRules,(req, res) =>{

  const errors = validationResult(req);

  if(!errors.isEmpty()) { // バリデーション失敗

    return res.status(422).json({ errors: errors.array() });

  }
  
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.pass;

  InsData(sql, value)
  .then(function(redURL) {
    if (redURL === "/login.html") {
      sql ='INSERT INTO user_info (user_name, pwd, address) SELECT CAST($3 AS VARCHAR), CAST($2 AS VARCHAR), CAST($1 AS VARCHAR);',
      value = [email,password,name];
  }else{
      sql = 'SELECT address FROM user_info WHERE address = $1;';
      value = [email];
  }
});
res.json({ result: true });
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
      if(res.rows.length == 0){
        redct = "/login.html";
        client.end();
        console.log();
        resolve(redct);
      }else{
        redct =false;
        client.end();
        console.log();
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