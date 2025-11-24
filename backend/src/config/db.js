const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '9db39eBd@Z&',
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'DICRI_DB',
    options: {
        encrypt: false, // For local dev with self-signed certs
        trustServerCertificate: true
    }
};

const getConnection = async (retries = 5) => {
    while (retries > 0) {
        try {
            const pool = await sql.connect(config);
            console.log('Database connected successfully');
            return pool;
        } catch (err) {
            console.error(`Database connection failed. Retries left: ${retries - 1}`, err.message);
            retries -= 1;
            if (retries === 0) throw err;
            await new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds
        }
    }
};

module.exports = {
    sql,
    getConnection
};
