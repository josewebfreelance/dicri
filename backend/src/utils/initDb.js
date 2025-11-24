const sql = require('mssql');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '9db39eBd@Z&',
    server: process.env.DB_SERVER || 'localhost',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const initDb = async () => {
    let pool;
    let retries = 10;
    while (retries > 0) {
        try {
            console.log(`Connecting to SQL Server to check database... (Attempts left: ${retries})`);
            pool = await sql.connect(config);

            const result = await pool.request().query("SELECT name FROM sys.databases WHERE name = 'DICRI_DB'");
            if (result.recordset.length === 0) {
                console.log('Database DICRI_DB does not exist. Creating...');
                await pool.request().query('CREATE DATABASE DICRI_DB');
                console.log('Database created.');
            } else {
                console.log('Database DICRI_DB already exists.');
            }

            await pool.close();

            const dbConfig = { ...config, database: 'DICRI_DB' };
            pool = await sql.connect(dbConfig);

            console.log('Running initialization script...');

            // Check multiple paths for init.sql (Docker vs Local)
            const possiblePaths = [
                path.join(__dirname, '../../init.sql'), // Docker volume mount
                path.join(__dirname, '../../../database/init.sql') // Local dev
            ];

            let initSqlPath = null;
            for (const p of possiblePaths) {
                if (fs.existsSync(p)) {
                    initSqlPath = p;
                    break;
                }
            }

            if (initSqlPath) {
                const sqlContent = fs.readFileSync(initSqlPath, 'utf8');
                const commands = sqlContent.split(/^\s*GO\s*$/gm);

                for (const command of commands) {
                    if (command.trim()) {
                        try {
                            await pool.request().query(command);
                        } catch (e) {
                            console.log('Command executed or skipped.');
                        }
                    }
                }
                console.log('Initialization script completed.');
            } else {
                console.warn('init.sql not found at ' + initSqlPath);
            }

            return; // Success, exit function

        } catch (err) {
            console.error('Database initialization attempt failed:', err.message);
            retries--;
            if (retries === 0) {
                console.error('All initialization attempts failed.');
            } else {
                await new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds
            }
        } finally {
            if (pool) await pool.close();
        }
    }
};

module.exports = initDb;

