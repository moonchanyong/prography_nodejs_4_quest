const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const run_crawlR = require('./routes/run_crawl');
const listR = require('./routes/list');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/run_crawl', run_crawlR);
app.use('/list', listR);

module.exports = app;
