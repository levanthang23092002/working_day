"use strict";

var express = require("express");

var cors = require('cors');

var helmet = require('helmet');

require('dotenv').config();

var router = require('./src/routers/index');

var pool = require('./src/models/connect_db');

pool.connect();
var app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use('/api', router);
var port = process.env.Port || 3000;
app.listen(port, function () {
  console.log("Woking day listening on : http://localhost:".concat(port));
});