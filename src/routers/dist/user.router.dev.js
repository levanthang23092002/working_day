"use strict";

var express = require('express');

var users = express.Router();

var user = require("../controllers/user.controller");

require('dotenv').config();

users.get('/page:page', user.getAllUsers);
users.get('/:id', user.getUser);
users.post('/add', user.postUser);
users.put('/update/:id', user.updateUser);
module.exports = users;