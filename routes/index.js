'use strict';
const express = require('express');
const router = express.Router();
const Channel = require('../models/channel');


/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.user) {
    Channel.findAll({
      order: [['"channelName"', 'DESC']]
    }).then((channels) => {
      res.render('index', {
        user: req.user,
        channels: channels
      });
    });
  } else {
    res.render('index', { title: 'Express' });
  }

});

module.exports = router;
