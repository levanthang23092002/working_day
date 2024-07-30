const user = require("../services/user.service");

exports.getAllUsers = (req, res) => {
  const page = req.params.page || 1;
  user.getall(page, (error, results) => {
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


exports.getUser = (req, res) => {
  const id = req.params.id
  user.getUser(id, (error, results) => {
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
          message: `Không có người dùng ${id}`,
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

exports.postUser = (req, res) => {
  const { id, first_name, last_name, email, gender, ip_address, days } = req.body;
  const values = [id, first_name, last_name, email, gender, ip_address, days]
  user.PostUser(values, (error, results) => {
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
        message: 'Đã Thêm Thành công',
  
      });
    }
  });
};

exports.updateUser = (req, res) => {
  const id = req.params.id
  const {  first_name, last_name, email, gender } = req.body;
  const values = [ first_name, last_name, email, gender]
  user.UpdateUser(id,values, (error, results) => {
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
        data: results,
      });
    }
  });
};