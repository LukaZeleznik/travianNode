const setTimezone = require('set-tz');
setTimezone('Europe/Ljubljana');

const express = require('express');
const schedule = require('node-schedule');
const app = express();
const router = express.Router();
const db = require('./db');
//const sharks = require('./routes/sharks');
const api = require('./routes/api');
var cors = require('cors');


//const path = __dirname + '/views/';
const port = process.env.PORT || 8080;

app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'html');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
//app.use(express.static(path));
//app.use('/sharks', sharks);
app.use('/api', api);

app.listen(port, function () {
    console.log(`Example app listening on ${port}!`);
  });