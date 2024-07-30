"use strict";

var express = require('express');

var router = express.Router();

var users = require("./user.router");

var meet = require("./meeting.router");

router.use('/user', users);
router.use('/meet', meet);
module.exports = router;