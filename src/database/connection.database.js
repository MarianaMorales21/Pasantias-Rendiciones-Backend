import mysql from 'mysql2/promise';
import { DB_user, DB_database, DB_host, DB_password, DB_port } from "../config.js";


export const db = await mysql.createPool({
    host: DB_host,
    user: DB_user,
    password: DB_password,
    database: DB_database,
    port: DB_port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

try {
    
    await db.query('SELECT 1'); 
    await db.query('ALTER TABLE drn_ren MODIFY COLUMN par_drn INT NULL');
    console.log(`✅ Connected to MySQL database: ${DB_database}`);
} catch (error) {
    console.error('❌ Error connecting to database:', error.message);
}