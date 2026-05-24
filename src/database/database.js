import { Sequelize } from 'sequelize';
import { DB_database, DB_password, DB_user, DB_host, DB_port } from '../config.js'
const sequelize = new Sequelize(DB_database, DB_user, DB_password, {
    host: DB_host || 'localhost',
    port: DB_port || 3306,
    dialect: 'mysql',
});

export default sequelize;