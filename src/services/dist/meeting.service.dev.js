"use strict";

var _require = require('util'),
    callbackify = _require.callbackify;

var db = require('../models/connect_db');

var _require2 = require('console'),
    error = _require2.error;

function merged(arr) {
  var tg = arr.length - 1;
  arr.sort(function (a, b) {
    return a.start_day - b.start_day;
  });

  for (var i = 0; i < tg; i++) {
    if (arr[i].end_day >= arr[i + 1].start_day) {
      arr[i + 1].start_day = arr[i].start_day;

      if (arr[i].end_day > arr[i + 1].end_day) {
        arr[i + 1].end_day = arr[i].end_day;
      }
    }
  }

  var result = Object.values(arr.reduce(function (acc, item) {
    acc[item.start_day] = item;
    return acc;
  }, {}));
  return result;
}

var meeting = {
  getAllMeeting: function getAllMeeting(page, callback) {
    try {
      var perPage = 5;
      var offset = perPage * page - perPage;
      var query = "SELECT u.id, u.first_name, u.last_name, u.email, u.gender, u.days, m.start_day, m.end_day\n                        FROM users u\n                        INNER JOIN meetings m ON u.id = m.user_id\n                        ORDER BY u.id\n                       ";
      db.query(query, function (error, results) {
        if (error) {
          console.log('Error executing query:', error);
          callback(error, null);
        } else {
          var data = results.rows;
          var result = data.reduce(function (acc, item) {
            var existingItem = acc.find(function (i) {
              return i.id === item.id;
            });

            if (existingItem) {
              existingItem.day_meeting.push({
                start_day: item.start_day,
                end_day: item.end_day
              });
            } else {
              acc.push({
                id: item.id,
                first_name: item.first_name,
                last_name: item.last_name,
                email: item.email,
                days: item.days,
                gender: item.gender,
                day_meeting: [{
                  start_day: item.start_day,
                  end_day: item.end_day
                }],
                days_without_meetings: 0
              });
            }

            return acc.splice(offset, perPage);
          }, []); // Tính toán lại days_without_meetings sau khi hợp nhất các khoảng ngày

          result.forEach(function (user) {
            var mergedMeetings = merged(user.day_meeting);
            var totalMeetingDays = mergedMeetings.reduce(function (sum, meeting) {
              return sum + (meeting.end_day - meeting.start_day + 1);
            }, 0);
            user.days_without_meetings = user.days - totalMeetingDays;
          });
          callback(null, result);
        }
      });
    } catch (error) {
      console.log(error);
      callback(error, null);
    }
  },
  getMeeting: function getMeeting(id, callback) {
    try {
      var query = "SELECT  u.id, u.first_name, u.last_name, u.email, u.gender, u.days, m.start_day, m.end_day\n                        FROM users u\n                        INNER JOIN meetings m ON u.id = m.user_id where m.user_id = ".concat(id, "\n                        ORDER BY u.id\n                        ");
      db.query(query, function (error, results) {
        if (error) {
          console.log('Error executing query:', error);
          callback(error, null);
        } else {
          var data = results.rows;
          var result = data.reduce(function (acc, curr) {
            var user = acc.find(function (u) {
              return u.id === curr.id;
            });

            if (!user) {
              user = {
                id: curr.id,
                first_name: curr.first_name,
                last_name: curr.last_name,
                email: curr.email,
                gender: curr.gender,
                days: curr.days,
                day_meet: [],
                days_without_meetings: 0
              };
              acc.push(user);
            }

            user.day_meet.push({
              start_day: curr.start_day,
              end_day: curr.end_day
            });
            return acc;
          }, []);
          var mergedMeetings = merged(result[0].day_meet);
          var totalMeetingDays = mergedMeetings.reduce(function (sum, meeting) {
            return sum + (meeting.end_day - meeting.start_day + 1);
          }, 0);
          result[0].days_without_meetings = result[0].days - totalMeetingDays;
          callback(null, result);
        }
      });
    } catch (error) {
      console.log(error);
      callback(error, null);
    }
  },
  getallmeets: function getallmeets(page, callback) {
    try {
      var perPage = 5;
      var offset = perPage * page - perPage;
      var query = "select id, user_id, room_id, start_day, end_day from meetings LIMIT ".concat(perPage, " OFFSET ").concat(offset, " ");
      db.query(query, function (error, results) {
        if (error) {
          console.log('Error executing query:', error);
          callback(error, null);
        } else {
          callback(null, results.rows);
        }
      });
    } catch (error) {
      console.log('Error executing query:', error);
      callback(error, null);
    }
  },
  getmeets: function getmeets(id, callback) {
    try {
      var query = "select id, user_id, room_id, start_day, end_day from meetings where id = ".concat(id, " ");
      db.query(query, function (error, results) {
        if (error) {
          console.log('Error executing query:', error);
          callback(error, null);
        } else {
          callback(null, results.rows);
        }
      });
    } catch (error) {
      console.log('Error executing query:', error);
      callback(error, null);
    }
  },
  updateMeeting: function updateMeeting(id, data, callback) {
    var query = "\n        UPDATE meetings SET user_id = $1, room_id = $2, start_day = $3, end_day = $4 WHERE id = ".concat(id, " \n    ");
    db.query(query, data, function (error, results) {
      if (error) {
        console.log('Error executing query:', error);
        callback(error, null);
      } else {
        callback(null, results.rowCount);
      }
    });
  },
  postMeeting: function postMeeting(data, callback) {
    var query = "INSERT INTO meetings (id, user_id, room_id, start_day, end_day)\n                  VALUES ($1, $2, $3, $4, $5)\n    ";
    db.query(query, data, function (error, results) {
      if (error) {
        console.log('Error executing query:', error);
        callback(error, null);
      } else {
        callback(null, results.rowCount);
      }
    });
  }
};
module.exports = meeting;