const meet = require("../services/meeting.service")

exports.getAllmeeting = (req, res) => {
    const page = req.params.page || 1;
    meet.getAllMeeting(page,(err, result) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'Lỗi Hệ Thống',
                data: {},
                error_code: err
              });
        }else if(result === 0){
            res.status(401).json({
                success: true,
                message: 'Không Tìm thấy ',
                data: {},
                error_code: null
              });
        }else{
            res.status(200).json({
                success: true,
                message: 'danh sách',
                data: result,
                error_code: null
              });
        }
        
    })
}

exports.getmeeting = (req, res) => {
    const id = req.params.id
    meet.getMeeting(id,(err, result) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'Lỗi Hệ Thống',
                data: {},
                error_code: err
              });
        }else if(result === 0){
            res.status(401).json({
                success: true,
                message: 'Không Tìm thấy ',
                data: {},
                error_code: null
              });
        }else{
            res.status(200).json({
                success: true,
                message: 'Thông tin các cuộc meeting của user '+ id,
                data: result,
                error_code: null
              });
        }
        
    })
}


exports.updateMeeting = (req, res) => {
    const id = req.params.id;
    const {user_id, room_id, start_day, end_day} = req.body;
    const values =[ user_id, room_id, start_day, end_day];
    meet.updateMeeting(id,values,(err, result) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'Lỗi Hệ Thống',
                data: {},
                error_code: err
              });
        }else if(result === 0){
            res.status(401).json({
                success: true,
                message: 'Không Tìm thấy ',
                data: {},
                error_code: null
              });
        }else{
            res.status(200).json({
                success: true,
                message: 'Thông tin các cuộc meeting của user '+ id,
                data: req.body,
                error_code: null
              });
        }
        
    })
}


exports.getallMeets = (req, res) => {
    const page = req.params.page;
    
    meet.getallmeets(page,(err, result) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'Lỗi Hệ Thống',
                data: {},
                error_code: err
              });
        }else if(result === 0){
            res.status(401).json({
                success: true,
                message: 'Không Tìm thấy ',
                data: {},
                error_code: null
              });
        }else{
            res.status(200).json({
                success: true,
                message: 'danh sách meetings ',
                data: result,
                error_code: null
              });
        }
        
    })
}

exports.getMeet = (req, res) => {
    const id = req.params.id;
    
    meet.getmeets(id,(err, result) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'Lỗi Hệ Thống',
                data: {},
                error_code: err
              });
        }else if(result === 0){
            res.status(401).json({
                success: true,
                message: 'Không Tìm thấy ',
                data: {},
                error_code: null
              });
        }else{
            res.status(200).json({
                success: true,
                message: 'danh sách meetings ',
                data: result,
                error_code: null
              });
        }
        
    })
}

exports.postMeeting = (req, res) => {
    const {id, user_id, room_id, start_day, end_day} = req.body;
    let values = [id, user_id, room_id, start_day, end_day]
    meet.postMeeting(values,(err, result) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'Lỗi Hệ Thống',
                data: {},
                error_code: err
              });
        }else if(result === 0){
            res.status(401).json({
                success: true,
                message: 'Không thể thêm  ',
                data: {},
                error_code: null
              });
        }else{
            res.status(200).json({
                success: true,
                message: 'thêm thành công',
                data: req.body,
                error_code: null
              });
        }
        
    })
}


