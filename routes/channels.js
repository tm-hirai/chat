'use strict';
const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const moment = require('moment-timezone');

const User = require('../models/user');
const Channel = require('../models/channel');
const Messages = require('../models/message');
const Message = require('../models/message');


/* GET users listing. */
// チャンネル作成ページ
router.get('/new', function (req, res, next) {
  res.render('new', { title: 'Express', user: req.user });
});
// チャンネル表示ページ
router.get('/:channelId', function (req, res, next) {
  (async () => {
    const channelId = req.params.channelId;
    const channel = await Channel.findByPk(channelId);
    const messages = await Messages.findAll({
      where: { channelId: channelId },
      includes: [{
        model: User,
        required: true
      }]
    });
    console.log(messages);
    res.render('channel', { title: 'Express', user: req.user, channel: channel, messages: messages });
  })().catch(next);

});
// チャンネル作成、削除
router.post('/', function (req, res, next) {
  const channelName = req.body.channelName;
  const channelId = uuid.v4();

  Channel.create({
    channelId: channelId,
    channelName: channelName
  }).then(() => {
    res.redirect(`/channels/${channelId}`);
  });
});
// メッセージ作成、削除
router.post('/:channelId/message', function (req, res, next) {
  console.log(req.params.channelId);
  console.log(req.body);

  const channelId = req.params.channelId;
  const content = req.body.content;
  const userId = req.body.userId;

  Message.create({
    content: content,
    postedBy: userId,
    channelId: channelId
  }).then((message) => {
    const formatedCreatedAt = moment(message.createdAt).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm');
    res.io.emit(channelId, { content: content, user: req.user, createdAt: formatedCreatedAt });
    res.json({ status: 'OK', content: content });
  });
  // res.render('channel', { title: 'Express', user: req.user });
});

module.exports = router;
