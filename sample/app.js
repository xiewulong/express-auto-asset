/*!
 * express auto controller sample
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2017/03/12
 * since: 0.0.1
 */
'use strict';

const path = require('path');

const express = require('express');
const autoController = require('express-auto-controller');
const logger = require('morgan');
const peppa = require('peppa');

const autoAsset = require('../');

const app = express();

app.alias = peppa.alias();
app.alias('@npm', path.resolve(__dirname, '..', 'node_modules'));
app.alias('@app', __dirname);
app.alias('@static', app.alias('@app/dist'));
app.alias('@web', '/');

app.set('views', app.alias('@app/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.autoAsset();
app.use(express.static(app.alias('@static')));
app.autoController(app.alias('@app/controllers'));

app.use(function(req, res, next) {
  res.status(404).send('404');
});

app.listen(3000);
