'use strict';
const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const Channel = require('../models/channel');

/* GET users listing. */
// チャンネル作成ページ
router.get('/new', function (req, res, next) {
  res.render('new', { title: 'Express', user: req.user });
});
// チャンネル表示ページ
router.get('/:channelId', function (req, res, next) {
  console.log(req.params.channelId);
  res.render('channel', { title: 'Express', user: req.user });
});
// チャンネル作成、削除
router.post('/', function (req, res, next) {

  const channelName = req.body.channelName;
  const channelId = uuid.v4();

  Channel.create({
    channelId: channelId,
    channelName: channelName
  }).then(() => {
    res.redirect('/');
  });
});
// メッセージ作成、削除
router.post('/:channelId/message', function (req, res, next) {
  console.log('message' + req.params.channelId);
  res.render('channel', { title: 'Express', user: req.user });
});



module.exports = router;
