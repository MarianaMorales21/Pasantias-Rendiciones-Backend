import { db } from '../database/connection.database.js';

const getAccountantsModel = async () => {
    const [rows] = await db.query(`
        SELECT c.*, s.nom_sta 
        FROM ctd_ren c
        JOIN sta_ren s ON c.sta_ctd = s.cod_sta
    `);
    return rows;
};

const getAccountantModel = async ({ ced_ctd }) => {
    const [rows] = await db.query(`
        SELECT c.*, s.nom_sta 
        FROM ctd_ren c
        JOIN sta_ren s ON c.sta_ctd = s.cod_sta
        WHERE c.ced_ctd=?
    `, [ced_ctd]);
    return rows[0];
};

const createAccountantModel = async ({ ced_ctd, ape_ctd, nom_ctd, dir_ctd, sta_ctd }) => {
    await db.query(
        'INSERT INTO ctd_ren (ced_ctd, ape_ctd, nom_ctd, dir_ctd, sta_ctd) VALUES (?,?,?,?,?)', 
        [ced_ctd, ape_ctd, nom_ctd, dir_ctd, parseInt(sta_ctd)]
    );
    return { ced_ctd, ape_ctd, nom_ctd, dir_ctd, sta_ctd };
};

const updateAccountantModel = async (ced_ctd, { ape_ctd, nom_ctd, dir_ctd, sta_ctd }) => {
    await db.query(
        'UPDATE ctd_ren SET ape_ctd=?, nom_ctd=?, dir_ctd=?, sta_ctd=? WHERE ced_ctd=?',
        [ape_ctd, nom_ctd, dir_ctd, parseInt(sta_ctd), ced_ctd]
    );
    return { ape_ctd, nom_ctd, dir_ctd, sta_ctd, ced_ctd };
};

const deleteAccountantModel = async ({ ced_ctd }) => {
    const [result] = await db.query('DELETE FROM ctd_ren WHERE ced_ctd=?', [ced_ctd]);
    return result.affectedRows > 0;
};

export const accountantModel = {
    getAccountantModel,
    getAccountantsModel,
    createAccountantModel,
    updateAccountantModel,
    deleteAccountantModel,
};