require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const moment = require('moment');




// Đọc dữ liệu từ các file JSON
const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));
const meetingsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'meetings.json'), 'utf8'));

// Thông tin kết nối cơ sở dữ liệu
const dbPort = process.env.DB_PORT;
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const initialPool = new Pool({
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: 'postgres',
});

const pool = new Pool({
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: dbName,
});

const createDatabaseIfNotExists = async () => {
    const client = await initialPool.connect();
    try {
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
        if (res.rowCount === 0) {
            await client.query(`CREATE DATABASE ${dbName}`);
            console.log(`Database "${dbName}" created`);
        } else {
            console.log(`Database "${dbName}" already exists`);
        }
    } catch (err) {
        console.error('Error checking or creating database:', err);
    } finally {
        client.release();
    }
};

const createTables = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                email VARCHAR(100),
                gender VARCHAR(20),
                ip_address VARCHAR(100),
                days INTEGER CHECK (days >= 1 AND days <= 50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS meetings (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                room_id INTEGER,
                start_day INTEGER,
                end_day INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CHECK (start_day >= 1 AND end_day <= 50 AND start_day <= end_day)
            )
        `);

        console.log('Tables have been created');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        client.release();
    }
};

const insertData = async () => {
    const client = await pool.connect();
    try {
        const validUsersData = usersData.filter(user => user.days >= 1 && user.days <= 50);
        for (const user of validUsersData) {
            await client.query(`
                INSERT INTO users (id, first_name, last_name, email, gender, ip_address, days)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (id) DO NOTHING
            `, [user.id, user.first_name, user.last_name, user.email, user.gender, user.ip_address, user.days]);
        }

        console.log('Data inserted into users table');

        for (const meeting of meetingsData) {
            const formattedDate =await moment().format('YYYY-MM-DD HH:mm:ss.SSS');
            await client.query(`
                INSERT INTO meetings (id, user_id, room_id, start_day, end_day, created_at)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (id) DO NOTHING
            `, [meeting.id, meeting.user_id, meeting.room_id, meeting.start_day, meeting.end_day, formattedDate]);
        }

        console.log('Data inserted into meetings table');
    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        client.release();
    }
};

(async () => {
    try {
        await createDatabaseIfNotExists();
        await createTables();
        await insertData();
    } catch (err) {
        console.error('Error in database setup:', err);
    }
})();

module.exports = {
    createDatabaseIfNotExists,
    createTables,
    insertData,
};
