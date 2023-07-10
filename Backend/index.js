const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');


// ホームページの表示
router.get('/', (req, res) => {
    const filePath = path.join(__dirname,'../designDictionary' ,'html','index.html');
  res.sendFile(filePath);
});


module.exports =router;