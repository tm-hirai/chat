'use strict';
const express = require('express');
const router = express.Router();

/* GET users listing. */
// チャンネル作成ページ
router.get('/new', function (req, res, next) {
  res.render('channel', { title: 'Express', user: req.user });
});
// チャンネル表示ページ
router.get('/:channelId', function (req, res, next) {
  console.log(req.params.channelId);
  res.render('channel', { title: 'Express', user: req.user });
});
// チャンネル作成、削除
router.post('/', function (req, res, next) {
  res.send('respond with a resource');
});
// メッセージ作成、削除
router.post('/:channelId/message', function (req, res, next) {
  console.log('message' + req.params.channelId);
  res.render('channel', { title: 'Express', user: req.user });
});



module.exports = router;
