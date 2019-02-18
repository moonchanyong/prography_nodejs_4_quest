var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var run_crawlR = require('./routes/run_crawl');
var listR = require('./routes/list');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/run_crawl', run_crawlR);
app.use('/list', listR);

module.exports = app;
