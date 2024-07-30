"use strict";

var meet = require("../services/meeting.service");

exports.getAllmeeting = function (req, res) {
  var page = req.params.page || 1;
  meet.getAllMeeting(page, function (err, result) {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Lỗi Hệ Thống',
        data: {},
        error_code: err
      });
    } else if (result === 0) {
      res.status(401).json({
        success: true,
        message: 'Không Tìm thấy ',
        data: {},
        error_code: null
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'danh sách',
        data: result,
        error_code: null
      });
    }
  });
};

exports.getmeeting = function (req, res) {
  var id = req.params.id;
  meet.getMeeting(id, function (err, result) {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Lỗi Hệ Thống',
        data: {},
        error_code: err
      });
    } else if (result === 0) {
      res.status(401).json({
        success: true,
        message: 'Không Tìm thấy ',
        data: {},
        error_code: null
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Thông tin các cuộc meeting của user ' + id,
        data: result,
        error_code: null
      });
    }
  });
};

exports.updateMeeting = function (req, res) {
  var id = req.params.id;
  var _req$body = req.body,
      user_id = _req$body.user_id,
      room_id = _req$body.room_id,
      start_day = _req$body.start_day,
      end_day = _req$body.end_day;
  var values = [user_id, room_id, start_day, end_day];
  meet.updateMeeting(id, values, function (err, result) {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Lỗi Hệ Thống',
        data: {},
        error_code: err
      });
    } else if (result === 0) {
      res.status(401).json({
        success: true,
        message: 'Không Tìm thấy ',
        data: {},
        error_code: null
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Thông tin các cuộc meeting của user ' + id,
        data: req.body,
        error_code: null
      });
    }
  });
};

exports.getallMeets = function (req, res) {
  var page = req.params.page;
  meet.getallmeets(page, function (err, result) {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Lỗi Hệ Thống',
        data: {},
        error_code: err
      });
    } else if (result === 0) {
      res.status(401).json({
        success: true,
        message: 'Không Tìm thấy ',
        data: {},
        error_code: null
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'danh sách meetings ',
        data: result,
        error_code: null
      });
    }
  });
};

exports.getMeet = function (req, res) {
  var id = req.params.id;
  meet.getmeets(id, function (err, result) {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Lỗi Hệ Thống',
        data: {},
        error_code: err
      });
    } else if (result === 0) {
      res.status(401).json({
        success: true,
        message: 'Không Tìm thấy ',
        data: {},
        error_code: null
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'danh sách meetings ',
        data: result,
        error_code: null
      });
    }
  });
};

exports.postMeeting = function (req, res) {
  var _req$body2 = req.body,
      id = _req$body2.id,
      user_id = _req$body2.user_id,
      room_id = _req$body2.room_id,
      start_day = _req$body2.start_day,
      end_day = _req$body2.end_day;
  var values = [id, user_id, room_id, start_day, end_day];
  meet.postMeeting(values, function (err, result) {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Lỗi Hệ Thống',
        data: {},
        error_code: err
      });
    } else if (result === 0) {
      res.status(401).json({
        success: true,
        message: 'Không thể thêm  ',
        data: {},
        error_code: null
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'thêm thành công',
        data: req.body,
        error_code: null
      });
    }
  });
};