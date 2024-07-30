"use strict";

require('dotenv').config();

var _require = require('pg'),
    Pool = _require.Pool;

var fs = require('fs');

var path = require('path');

var moment = require('moment'); // Đọc dữ liệu từ các file JSON


var usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));
var meetingsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'meetings.json'), 'utf8')); // Thông tin kết nối cơ sở dữ liệu

var dbPort = process.env.DB_PORT;
var dbHost = process.env.DB_HOST;
var dbUser = process.env.DB_USER;
var dbPassword = process.env.DB_PASSWORD;
var dbName = process.env.DB_NAME;
var initialPool = new Pool({
  user: dbUser,
  password: dbPassword,
  host: dbHost,
  port: dbPort,
  database: 'postgres'
});
var pool = new Pool({
  user: dbUser,
  password: dbPassword,
  host: dbHost,
  port: dbPort,
  database: dbName
});

var createDatabaseIfNotExists = function createDatabaseIfNotExists() {
  var client, res;
  return regeneratorRuntime.async(function createDatabaseIfNotExists$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(initialPool.connect());

        case 2:
          client = _context.sent;
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]));

        case 6:
          res = _context.sent;

          if (!(res.rowCount === 0)) {
            _context.next = 13;
            break;
          }

          _context.next = 10;
          return regeneratorRuntime.awrap(client.query("CREATE DATABASE ".concat(dbName)));

        case 10:
          console.log("Database \"".concat(dbName, "\" created"));
          _context.next = 14;
          break;

        case 13:
          console.log("Database \"".concat(dbName, "\" already exists"));

        case 14:
          _context.next = 19;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](3);
          console.error('Error checking or creating database:', _context.t0);

        case 19:
          _context.prev = 19;
          client.release();
          return _context.finish(19);

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 16, 19, 22]]);
};

var createTables = function createTables() {
  var client;
  return regeneratorRuntime.async(function createTables$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(pool.connect());

        case 2:
          client = _context2.sent;
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(client.query("\n            CREATE TABLE IF NOT EXISTS users (\n                id SERIAL PRIMARY KEY,\n                first_name VARCHAR(100),\n                last_name VARCHAR(100),\n                email VARCHAR(100),\n                gender VARCHAR(20),\n                ip_address VARCHAR(100),\n                days INTEGER CHECK (days >= 1 AND days <= 50),\n                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n            )\n        "));

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(client.query("\n            CREATE TABLE IF NOT EXISTS meetings (\n                id SERIAL PRIMARY KEY,\n                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,\n                room_id INTEGER,\n                start_day INTEGER,\n                end_day INTEGER,\n                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n                CHECK (start_day >= 1 AND end_day <= 50 AND start_day <= end_day)\n            )\n        "));

        case 8:
          console.log('Tables have been created');
          _context2.next = 14;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](3);
          console.error('Error creating tables:', _context2.t0);

        case 14:
          _context2.prev = 14;
          client.release();
          return _context2.finish(14);

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 11, 14, 17]]);
};

var insertData = function insertData() {
  var client, validUsersData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, user, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, meeting, formattedDate;

  return regeneratorRuntime.async(function insertData$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(pool.connect());

        case 2:
          client = _context3.sent;
          _context3.prev = 3;
          validUsersData = usersData.filter(function (user) {
            return user.days >= 1 && user.days <= 50;
          });
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context3.prev = 8;
          _iterator = validUsersData[Symbol.iterator]();

        case 10:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context3.next = 17;
            break;
          }

          user = _step.value;
          _context3.next = 14;
          return regeneratorRuntime.awrap(client.query("\n                INSERT INTO users (id, first_name, last_name, email, gender, ip_address, days)\n                VALUES ($1, $2, $3, $4, $5, $6, $7)\n                ON CONFLICT (id) DO NOTHING\n            ", [user.id, user.first_name, user.last_name, user.email, user.gender, user.ip_address, user.days]));

        case 14:
          _iteratorNormalCompletion = true;
          _context3.next = 10;
          break;

        case 17:
          _context3.next = 23;
          break;

        case 19:
          _context3.prev = 19;
          _context3.t0 = _context3["catch"](8);
          _didIteratorError = true;
          _iteratorError = _context3.t0;

        case 23:
          _context3.prev = 23;
          _context3.prev = 24;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 26:
          _context3.prev = 26;

          if (!_didIteratorError) {
            _context3.next = 29;
            break;
          }

          throw _iteratorError;

        case 29:
          return _context3.finish(26);

        case 30:
          return _context3.finish(23);

        case 31:
          console.log('Data inserted into users table');
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context3.prev = 35;
          _iterator2 = meetingsData[Symbol.iterator]();

        case 37:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context3.next = 47;
            break;
          }

          meeting = _step2.value;
          _context3.next = 41;
          return regeneratorRuntime.awrap(moment().format('YYYY-MM-DD HH:mm:ss.SSS'));

        case 41:
          formattedDate = _context3.sent;
          _context3.next = 44;
          return regeneratorRuntime.awrap(client.query("\n                INSERT INTO meetings (id, user_id, room_id, start_day, end_day, created_at)\n                VALUES ($1, $2, $3, $4, $5, $6)\n                ON CONFLICT (id) DO NOTHING\n            ", [meeting.id, meeting.user_id, meeting.room_id, meeting.start_day, meeting.end_day, formattedDate]));

        case 44:
          _iteratorNormalCompletion2 = true;
          _context3.next = 37;
          break;

        case 47:
          _context3.next = 53;
          break;

        case 49:
          _context3.prev = 49;
          _context3.t1 = _context3["catch"](35);
          _didIteratorError2 = true;
          _iteratorError2 = _context3.t1;

        case 53:
          _context3.prev = 53;
          _context3.prev = 54;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 56:
          _context3.prev = 56;

          if (!_didIteratorError2) {
            _context3.next = 59;
            break;
          }

          throw _iteratorError2;

        case 59:
          return _context3.finish(56);

        case 60:
          return _context3.finish(53);

        case 61:
          console.log('Data inserted into meetings table');
          _context3.next = 67;
          break;

        case 64:
          _context3.prev = 64;
          _context3.t2 = _context3["catch"](3);
          console.error('Error inserting data:', _context3.t2);

        case 67:
          _context3.prev = 67;
          client.release();
          return _context3.finish(67);

        case 70:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 64, 67, 70], [8, 19, 23, 31], [24,, 26, 30], [35, 49, 53, 61], [54,, 56, 60]]);
};

(function _callee() {
  return regeneratorRuntime.async(function _callee$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(createDatabaseIfNotExists());

        case 3:
          _context4.next = 5;
          return regeneratorRuntime.awrap(createTables());

        case 5:
          _context4.next = 7;
          return regeneratorRuntime.awrap(insertData());

        case 7:
          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.error('Error in database setup:', _context4.t0);

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
})();

module.exports = {
  createDatabaseIfNotExists: createDatabaseIfNotExists,
  createTables: createTables,
  insertData: insertData
};