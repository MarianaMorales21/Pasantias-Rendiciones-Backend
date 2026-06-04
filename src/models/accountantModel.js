import { db } from '../database/connection.database.js';

const getAccountantsModel = async () => {
    const [rows] = await db.query(`
        SELECT c.*, s.nom_sta 
        FROM ctd_ren c
        JOIN sta_ren s ON c.sta_ctd = s.cod_sta
    `);
    return rows;
};

const getAccountantModel = async ({ cod_ctd, ced_ctd }) => {
    let query, params;
    if (cod_ctd) {
        query = `SELECT c.*, s.nom_sta FROM ctd_ren c JOIN sta_ren s ON c.sta_ctd = s.cod_sta WHERE c.cod_ctd=?`;
        params = [cod_ctd];
    } else if (ced_ctd) {
        query = `SELECT c.*, s.nom_sta FROM ctd_ren c JOIN sta_ren s ON c.sta_ctd = s.cod_sta WHERE c.ced_ctd=?`;
        params = [ced_ctd];
    }
    const [rows] = await db.query(query, params);
    return rows[0];
};

const createAccountantModel = async ({ ced_ctd, ape_ctd, nom_ctd, dir_ctd, sta_ctd }) => {
    const [result] = await db.query(
        'INSERT INTO ctd_ren (ced_ctd, ape_ctd, nom_ctd, dir_ctd, sta_ctd) VALUES (?,?,?,?,?)', 
        [ced_ctd, ape_ctd, nom_ctd, dir_ctd, parseInt(sta_ctd)]
    );
    return { cod_ctd: result.insertId, ced_ctd, ape_ctd, nom_ctd, dir_ctd, sta_ctd };
};

const updateAccountantModel = async (cod_ctd, { ced_ctd, ape_ctd, nom_ctd, dir_ctd, sta_ctd }) => {
    await db.query(
        'UPDATE ctd_ren SET ced_ctd=?, ape_ctd=?, nom_ctd=?, dir_ctd=?, sta_ctd=? WHERE cod_ctd=?',
        [ced_ctd, ape_ctd, nom_ctd, dir_ctd, parseInt(sta_ctd), cod_ctd]
    );
    return { cod_ctd, ced_ctd, ape_ctd, nom_ctd, dir_ctd, sta_ctd };
};

const deleteAccountantModel = async ({ cod_ctd }) => {
    const [result] = await db.query('DELETE FROM ctd_ren WHERE cod_ctd=?', [cod_ctd]);
    return result.affectedRows > 0;
};

export const accountantModel = {
    getAccountantModel,
    getAccountantsModel,
    createAccountantModel,
    updateAccountantModel,
    deleteAccountantModel,
};
