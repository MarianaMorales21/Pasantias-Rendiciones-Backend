import { Sequelize } from 'sequelize';
import { DB_database, DB_password, DB_user } from '../config.js'
const sequelize = new Sequelize(DB_database, DB_user, DB_password, {
    host: 'localhost',
    dialect: 'mysql',
});

export default sequelize;