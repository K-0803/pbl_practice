const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');   //相対パスを使用可能にする
const bodyParser = require('body-parser');  //req.bodyを使用できるようにする
const router = express.Router();

var html = require('fs').readFileSync('../designDictionary/html/postDetails.html');
const {Client} = require("pg");

//ミドルウェアの設定
app.use(bodyParser.urlencoded({ extended: true }));    //req.bodyを使用するためのミドルウェア
app.use(bodyParser.json());                             //
app.use(express.static(path.join('../designDictionary'))); 
app.use(express.json());
app.use(cookieParser());

app.set('views', path.join(__dirname, '../designDictionary/html/views'));

// ホームページの表示
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'../designDictionary' ,'html','postDetails.html'));
});

router.post('/', function(req, res) {

  async function executeDBOperations(){
    const client = new Client({
      user: "postgres",//ユーザー名
      host: "database-1.c8lfh7qeqrkx.us-east-1.rds.amazonaws.com",//ホスト
      database: "postgres",//DB名
      password: "shirokuma123",//ユーザーパスワード
      port: 5432,
    });

    const {htmlCode} = req.body;
    console.log("犯人：" + htmlCode);
  
    const query = {
      text: "SELECT chtml_code, write_comment from web_create where chtml_code = ($1)",
      values: [htmlCode],
    };
    await client.connect();
    client
      .query(query)
      .then(function(result) {
        console.log(result);
        const resultArray = result.rows;
  
        const comments = resultArray[0].write_comment;
        const htmlCode = resultArray[0].chtml_code;
  
        const htmlFilePath = `../designDictionary/saveFile/html/${htmlCode}.html`;
        const cssFilePath = `../designDictionary/saveFile/css/${htmlCode}.css`;
  
        Promise.all([
          fs.promises.readFile(htmlFilePath, 'utf8'),
          fs.promises.readFile(cssFilePath, 'utf8'),
        ])
          .then(function([htmlContent, cssContent]) {
            fs.readFile('../designDictionary/html/postDetails.html', 'utf8', function(err, originContent) {
              if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end();
              } else {
                console.log(htmlContent);
                console.log(cssContent);
                console.log(comments);
  
                const htmlTag = `${htmlContent}`;
                const cssTag = `${cssContent}`;
                const commentTag = `${comments}`;
  
                const htmlTxt = originContent.replace('{{カスタムされたHTMLを表示}}', htmlTag)
                                            .replace('{{カスタムされたCSSを表示}}', cssTag)
                                            .replace('{{投稿文転記}}', commentTag);
  
                res.setHeader('Content-Type', 'text/html');
                res.statusCode = 200;
                res.end(htmlTxt);
              }
            });
          })
          .catch(function(err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
          });
      })
      .catch(function(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
      })
      .finally(function() {
        client.end();
      });
  }
  executeDBOperations();

});

module.exports =router;
