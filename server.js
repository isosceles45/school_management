import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2';
import addSchool from './routes/addSchool.js';
import listSchool from './routes/listSchool.js';

dotenv.config();

const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database!");
});

app.use('/api/schools', addSchool(db));
app.use('/api/schools', listSchool(db));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
