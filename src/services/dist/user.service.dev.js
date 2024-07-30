"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

require('dotenv').config();

var db = require('../models/connect_db');

var user = {
  getall: function getall(page, callback) {
    var perPage = 12;
    var offset = perPage * page - perPage;
    var query = "select u.id ,u.first_name, u.last_name, u.email,u.gender, u.days  from users as u LIMIT ".concat(perPage, " OFFSET ").concat(offset);
    db.query(query, function (error, results) {
      if (error) {
        console.log('Error executing query:', error);
        callback(error, null);
      } else {
        var data = results.rows;

        var _user = data.map(function (person) {
          var id = person.id,
              first_name = person.first_name,
              last_name = person.last_name,
              rest = _objectWithoutProperties(person, ["id", "first_name", "last_name"]);

          return _objectSpread({
            id: id,
            fullName: "".concat(first_name, " ").concat(last_name)
          }, rest);
        });

        callback(null, _user);
      }
    });
  },
  getUser: function getUser(id, callback) {
    var query = "select first_name, last_name, email,gender, days from users where id = ".concat(id);
    db.query(query, function (error, results) {
      if (error) {
        console.log('Error executing query:', error);
        callback(error, null);
      } else {
        var data = results.rows;

        var _user2 = data.map(function (person) {
          var first_name = person.first_name,
              last_name = person.last_name,
              rest = _objectWithoutProperties(person, ["first_name", "last_name"]);

          return _objectSpread({
            fullName: "".concat(first_name, " ").concat(last_name)
          }, rest);
        });

        callback(null, _user2);
      }
    });
  },
  PostUser: function PostUser(data, callback) {
    var query = "\n                  INSERT INTO users (id, first_name, last_name, email, gender, ip_address, days)\n                  VALUES ($1, $2, $3, $4, $5, $6, $7)\n                  ON CONFLICT (id) DO NOTHING\n              ";
    db.query(query, data, function (error, results) {
      if (error) {
        console.log('Error executing query:', error);
        callback(error, null);
      } else {
        callback(null, results.rows);
      }
    });
  },
  UpdateUser: function UpdateUser(id, data, callback) {
    var query = "\n              UPDATE users SET first_name = $1, last_name = $2, email = $3, gender = $4 WHERE id = ".concat(id, " \n          ");
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
module.exports = user;