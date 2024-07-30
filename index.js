"use strict";
const express = require("express");
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const router = require('./src/routers/index')
const pool = require('./src/models/connect_db')

pool.connect();
const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());

app.use('/api', router);
const port = process.env.Port || 3000;
app.listen(port, ()=>{
    console.log(`Woking day listening on : http://localhost:${port}`)
})