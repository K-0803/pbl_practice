const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const {v4: uuidv4} = require('uuid');
const {Client} = require("pg");
const cookieParser = require('cookie-parser');
const puppeteer = require('puppeteer');
const port = 8080;

// const router = require('../designDictionary/html/login.html');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../designDictionary')));
app.use(express.json());

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.get('/', function(req, res){
  const filePath = path.join('../designDictionary/html/webCreate.html');
  console.log(filePath);
  res.sendFile(filePath);

  res.end();
});

app.post('/generate', function(req, res){
  //cookieに保存されているuserIdを取得
  // const userId = req.cookies.userId;
  //デバッグ用userId
  const userId = 1;
  
    //入力データの取得
    const {htmlContent, cssContent, comment} = req.body;
    console.log(htmlContent + cssContent + comment);
    //ファイル名を一意なIDとして生成
    const fileId = uuidv4();
  
    //HTMLファイルとCSSファイルを生成して保存
    const htmlFilePath = `../designDictionary/saveFile/html/${fileId}.html`;
    const cssFilePath = `../designDictionary/saveFile/css/${fileId}.css`;
    fs.writeFileSync(htmlFilePath, htmlContent);
    fs.writeFileSync(cssFilePath, cssContent);

    // (async () => {
    //   // Puppeteerを使用してウェブページのスクリーンショットを撮る
      
    //   const browser = await puppeteer.launch({headless: "new"});// 引数`headless: "new"`で新しいHeadlessモードを有効にする
    //   const page = await browser.pages();

    //   const relativePath = '../designDictionary/html/webCreate.html';
    //   const absolutePath = path.join(__dirname, relativePath);
    //   await page.goto(`file://${absolutePath}`);


    //   // await page.evaluate((html, css, comment) => {
    //   //   document.querySelector('#code').value = html;
    //   //   document.querySelector('#ccode').value = css;
    //   //   document.querySelector('#posting').value = comment;
    //   // }, htmlContent, cssContent, comment);
      

    //   const element = await page.$('#view'); // キャプチャする要素のセレクタを指定

    //   const screenshotPath = path.join(__dirname,`../designDictionary/saveFile/png/${fileId}.png`)
    //   await element.screenshot({ path: screenshotPath}); // ファイルにキャプチャ画像を保存

    //   await browser.close();
    //   console.log("スクリーンショット撮影");
    
    
    const client = new Client({
        user: "postgres",//ユーザー名
        host: "database-2.cgz0heptpctb.us-east-1.rds.amazonaws.com",//ホスト
        database: "postgres",//DB名
        password: "shirokuma123",//ユーザーパスワード
        port: 5432, 
    });
    client.connect();
    console.log("postgreに接続");
    const query = {
      text: "INSERT INTO web_create (user_id, ccss_code, chtml_code, write_comment) VALUES ($1, $2, $3, $4)",
      values: [userId, fileId, fileId, comment],
    };
    client.query(query, function(error, result){
      if(error){
        console.error('データベースエラー：', error);
        // res.status(500).send('データベースエラーが発生しました');
        res.redirect(req.baseUrl + '/html/index.html');
      }else{
        console.log("ファイルが生成され、データベースに保存された。");
        // res.send('ファイルが生成され、データベースに保存されました');
        res.redirect(req.baseUrl + '/html/webCreate.html');
      }
    });

  // })();
  

})

app.listen(port, function(){
  console.log(`サーバーが${port}で起動しました。`);
})
