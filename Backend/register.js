const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../designDictionary')));


//ejsルート
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../designDictionary/html/views'));

let messages = [];


app.get('/register',  async(req, res) => {
  var data={
    from: {name:'',email:'',epass:'',erepass:''}
  }
  res.render('register',data); 
});

app.post(
'/register',
[
  check('email').not().isEmpty().withMessage('この項目は必須入力です。'),
  check('pass').not().isEmpty().withMessage('この項目は必須入力です。'),
  //バリデーションをカスタムで作成
  check('repass')
    .custom((value, { req }) => {
      //一致した場合trueを返す
      if (req.body.pass === req.body.repass) {
        return true;
      }
    })
    .withMessage('パスワードと一致しません。'),
    check('name').not().isEmpty().withMessage('この項目は必須入力です。'),
  ],
function (req, res, next) {
  const errors = validationResult(req);
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.pass;

  console.log(name,email,password);
  
  let sql ='SELECT address FROM user_info WHERE address = $1;';
  let value = [email];
  let count=['email','pass','repass','name'];
      
      let i = 0;
      let condition = false;
  //エラーオブジェクトをerrorsに格納。
  if (!errors.isEmpty()) {
      errors.errors.forEach((error) => {
        console.log(error.path);
        condition = false;
      while (!condition) {
        if (count[i]==error.path) {
          messages[i]=(error.msg);
          condition = true;
          break;
          }else{
            i+= 1;
          }       
        }
      });  
        }
        //emailに重複確認
        InsData(sql,value)
        .then(function(over){
          if(over == false&&email!==''){
            console.log(messages);
            messages[0] = "重複したメールアドレスです";
          }
            console.log("2");
            console.log(messages);
            res.render('register',{from:{email:messages[0],epass:messages[1],erepass:messages[2],name:messages[3]}});
        }).catch(function(e){
        console.log(e);
        })

        //入力値すべてにエラーがなければinsertする[]
          if(errors.isEmpty()){
          sql ='INSERT INTO user_info (user_name, pwd, address) SELECT CAST($3 AS VARCHAR), CAST($2 AS VARCHAR), CAST($1 AS VARCHAR);',
          value = [email,password,name];;
         InsData(sql,value)
         .then(function(over){
          if(over==false){
         res.redirect(req.baseUrl + '/login.html');
         res.end();
          }
        }).catch(function(e){
          console.log(e);
        })
        }

})
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
         let redct  = true;
      console.log(res.rows.length );
      if(res.rows.length > 0){
        redct = false;
        client.end();
        resolve(redct);
      }else{
        redct = true;
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