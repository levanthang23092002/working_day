const express = require('express');
const router = express.Router();
const users = require("./user.router")
const meet = require("./meeting.router")


router.use('/user', users);
router.use('/meet', meet);

module.exports = router;