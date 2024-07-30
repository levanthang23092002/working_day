"use strict";

var user = require("../services/user.service");

exports.getAllUsers = function (req, res) {
  var page = req.params.page || 1;
  user.getall(page, function (error, results) {
    if (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi Hệ Thống',
        data: {},
        error_code: error
      });
    } else {
      if (results.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Không có người dùng',
          data: null,
          error_code: ''
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'danh sách người dùng',
          data: results,
          error_code: ''
        });
      }
    }
  });
};

exports.getUser = function (req, res) {
  var id = req.params.id;
  user.getUser(id, function (error, results) {
    if (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi Hệ Thống',
        data: {},
        error_code: error
      });
    } else {
      if (results.length === 0) {
        res.status(404).json({
          success: false,
          message: "Kh\xF4ng c\xF3 ng\u01B0\u1EDDi d\xF9ng ".concat(id),
          data: null,
          error_code: ''
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Thông tin người dùng',
          data: results,
          error_code: ''
        });
      }
    }
  });
};

exports.postUser = function (req, res) {
  var _req$body = req.body,
      id = _req$body.id,
      first_name = _req$body.first_name,
      last_name = _req$body.last_name,
      email = _req$body.email,
      gender = _req$body.gender,
      ip_address = _req$body.ip_address,
      days = _req$body.days;
  var values = [id, first_name, last_name, email, gender, ip_address, days];
  user.PostUser(values, function (error, results) {
    if (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi Hệ Thống',
        data: {},
        error_code: error
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Đã Thêm Thành công'
      });
    }
  });
};

exports.updateUser = function (req, res) {
  var id = req.params.id;
  var _req$body2 = req.body,
      first_name = _req$body2.first_name,
      last_name = _req$body2.last_name,
      email = _req$body2.email,
      gender = _req$body2.gender;
  var values = [first_name, last_name, email, gender];
  user.UpdateUser(id, values, function (error, results) {
    if (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi Hệ Thống',
        data: {},
        error_code: error
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Đã Sửa Thành công',
        data: results
      });
    }
  });
};