import { db } from '../database/connection.database.js';

const getStatesModel = async () => {
    const [rows] = await db.query('SELECT * FROM sta_ren');
    return rows;
};

const getStateModel = async ({ cod_sta }) => {
    const [rows] = await db.query('SELECT * FROM sta_ren WHERE cod_sta = ?', [cod_sta]);
    return rows[0];
};

export const stateModel = {
    getStatesModel,
    getStateModel,
};