const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { validationResult, check } = require('express-validator');
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../designDictionary')));


//ejsルート
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../designDictionary/html/views'));

router.get('/',  (req, res) => {
  var data={
    from: {name:'',email:'',epass:'',erepass:''}
  }
  res.render('register',data); 
});

router.post('/', [
  check('email').not().isEmpty().withMessage('この項目は必須入力です。'),
  check('pass').not().isEmpty().withMessage('この項目は必須入力です。'),
  check('repass').not().isEmpty().withMessage('この項目は必須入力です。'),
  check('name').not().isEmpty().withMessage('この項目は必須入力です。'),
  ],
function (req, res) {
  
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.pass;

  console.log(name,email,password);

  let count=['email','pass','repass','name'];
  let i = 0;
  let condition = false;
  let messages = [];
  let value = [email];
  let sql ='SELECT address FROM user_info WHERE address = $1;';
  //エラーオブジェクトをerrorsに格納。
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      errors.errors.forEach((error) => {
        console.log(error.path);
        condition = false;  
      while (!condition) {
        if (count[i]==error.path) {
          console.log(error.msg); 
          messages[i]=error.msg;
          condition = true;
          break;
          }else{
            i+= 1;
          }   
        } 

      }); 
      console.log("start"); 
 
        }
        console.log(messages[3]);
        condition = true;
        //emailに重複確認
        InsData(sql,value)
        .then(function(over){
          if(over == false||email!==''){
            messages[0] = "重複したメールアドレスです";
            condition = false;
          }
          console.log(over);
        }).catch(function(e){
        console.log(e);
        })

        
       

        //入力値すべてにエラーがなければinsertする[]
          if(errors.isEmpty()&&condition !== false){
          sql ='INSERT INTO user_info (user_name, pwd, address) VALUES( $1, $2, $3);',
          value = [name,password,email];
         InsData(sql,value)
         .then(function(over){
          console.log(over);
          if(over==true){
            console.log("登録");
            res.redirect('/login');
          }
        }).catch(function(e){
          console.log(e);
        })
        }else{
          console.log("2");
          console.log(messages);
          res.render('register',{from:{email:messages[0],epass:messages[1],erepass:messages[2],name:messages[3]}});
        }

})

// app.listen(8080, function() {
//   console.log('サーバーがポート8080で起動しました。');
// });
 function InsData(sql, value) {
  // postgres接続
  const { Client } = require('pg');
  const client = new Client({
    user: 'postgres', // ユーザー名
    host: 'database-1.cxtqqck72ahf.us-east-1.rds.amazonaws.com', // ホスト
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
         let redct  = Boolean;
      console.log(res.rows);
      if(res.rows.length !== 0){
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

module.exports =router;