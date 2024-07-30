require('dotenv').config();
const db = require('../models/connect_db');


const user = {
    getall: (page, callback)=>{
        let perPage = 12;
        let offset = (perPage * page) - perPage
        let query = `select u.id ,u.first_name, u.last_name, u.email,u.gender, u.days  from users as u LIMIT ${perPage} OFFSET ${offset}`;
        db.query(query, (error, results) => {
            if (error) {
              console.log('Error executing query:', error);
              callback(error, null);
            } else {
                const data = results.rows;
                const user = data.map(person => {
                    const { id,first_name, last_name, ...rest } = person;
                    return {
                      id: id,
                      fullName: `${first_name} ${last_name}`,
                      ...rest
                    };
                  });
              callback(null, user);
            }
          });
    },
    getUser: (id,callback)=>{
        let query = `select first_name, last_name, email,gender, days from users where id = ${id}`;
        db.query(query, (error, results) => {
            if (error) {
              console.log('Error executing query:', error);
              callback(error, null);
            } else {
                const data = results.rows;
                const user = data.map(person => {
                    const { first_name, last_name, ...rest } = person;
                    return {
                      fullName: `${first_name} ${last_name}`,
                      ...rest
                    };
                  });
              callback(null, user);
            }
          });
    },

    PostUser: (data,callback)=>{
        let query = `
                  INSERT INTO users (id, first_name, last_name, email, gender, ip_address, days)
                  VALUES ($1, $2, $3, $4, $5, $6, $7)
                  ON CONFLICT (id) DO NOTHING
              `;
        db.query(query,data, (error, results) => {
            if (error) {
              console.log('Error executing query:', error);
              callback(error, null);
            } else {
            
              callback(null, results.rows);
            }
          });
  },
  UpdateUser: (id,data,callback)=>{
    let query = `
              UPDATE users SET first_name = $1, last_name = $2, email = $3, gender = $4 WHERE id = ${id} 
          `;
    db.query(query,data, (error, results) => {
        if (error) {
          console.log('Error executing query:', error);
          callback(error, null);
        } else {
          callback(null, results.rowCount);
        }
      });
},
}
module.exports = user