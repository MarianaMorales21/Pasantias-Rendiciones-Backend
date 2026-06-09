import { db } from '../database/connection.database.js';

const getStatesModel = async () => {
    await ensureStateModel('Entregada');
    const [rows] = await db.query('SELECT * FROM sta_ren');
    return rows;
};

const getStateModel = async ({ cod_sta }) => {
    const [rows] = await db.query('SELECT * FROM sta_ren WHERE cod_sta = ?', [cod_sta]);
    return rows[0];
};

const getStateByNameModel = async (nom_sta) => {
    const [rows] = await db.query('SELECT * FROM sta_ren WHERE LOWER(nom_sta) = LOWER(?) LIMIT 1', [nom_sta]);
    return rows[0];
};

const ensureStateModel = async (nom_sta) => {
    const existing = await getStateByNameModel(nom_sta);
    if (existing) return existing;

    const [result] = await db.query('INSERT INTO sta_ren (nom_sta) VALUES (?)', [nom_sta]);
    return { cod_sta: result.insertId, nom_sta };
};

export const stateModel = {
    getStatesModel,
    getStateModel,
    getStateByNameModel,
    ensureStateModel,
};
