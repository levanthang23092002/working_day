const express = require('express');
const meeting = express.Router();
const meet = require("../controllers/meeting.controller")

meeting.get('/all/:page', meet.getAllmeeting);
meeting.get('/user/:id', meet.getmeeting);
meeting.get('/page:page', meet.getallMeets);
meeting.get('/id:id', meet.getMeet);
meeting.put('/update/:id', meet.updateMeeting);
meeting.post('/add', meet.postMeeting);

module.exports = meeting;