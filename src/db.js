import mysql from 'mysql2/promise'; 
import { DB_database, DB_host, DB_password, DB_port, DB_user } from './config.js';

export const pool = mysql.createPool({
    host: DB_host,
    user: DB_user,
    password: DB_password,
    database: DB_database,
    port: DB_port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});