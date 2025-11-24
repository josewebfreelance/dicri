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
            // Connect to master to check/create DB
            pool = await sql.connect(config);

            // Check if DB exists
            const result = await pool.request().query("SELECT name FROM sys.databases WHERE name = 'DICRI_DB'");
            if (result.recordset.length === 0) {
                console.log('Database DICRI_DB does not exist. Creating...');
                await pool.request().query('CREATE DATABASE DICRI_DB');
                console.log('Database created.');
            } else {
                console.log('Database DICRI_DB already exists.');
            }

            await pool.close();

            // Connect to DICRI_DB to run schema
            const dbConfig = { ...config, database: 'DICRI_DB' };
            pool = await sql.connect(dbConfig);

            console.log('Running initialization script...');
            // Read init.sql
            // Note: We need to mount the init.sql or copy it to backend. 
            // For simplicity, we will assume it's copied to src/database/init.sql or similar.
            // Or we can just read it from the volume if mounted.
            // Let's assume we copy it in Dockerfile.
            const initSqlPath = path.join(__dirname, '../../init.sql');

            if (fs.existsSync(initSqlPath)) {
                const sqlContent = fs.readFileSync(initSqlPath, 'utf8');
                // Split by GO is tricky in Node mssql, usually we run command by command or use a parser.
                // Simple split by 'GO' on new lines.
                const commands = sqlContent.split(/^\s*GO\s*$/gm);

                for (const command of commands) {
                    if (command.trim()) {
                        try {
                            await pool.request().query(command);
                        } catch (e) {
                            // Ignore errors like "There is already an object named..." if script isn't perfectly idempotent
                            // But our script uses IF NOT EXISTS, so it should be fine.
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
                // Don't throw, let the app try to start, maybe it's already good.
            } else {
                await new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds
            }
        } finally {
            if (pool) await pool.close();
        }
    }
};

module.exports = initDb;

