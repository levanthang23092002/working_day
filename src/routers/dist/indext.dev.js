"use strict";

var express = require('express');

var router = express.Router();

var users = require("./user.router");

router.get('/user', users);
module.exports = router;