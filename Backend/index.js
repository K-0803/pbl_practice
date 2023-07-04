
const express = require('express');
const app = express();
const router = express.Router();

app.use(express.static('public'));

// ホームページの表示
router.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


module.exports =router;