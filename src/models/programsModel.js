import { db } from "../database/connection.database.js";

const getProgramsModel = async () => {
    const [rows] = await db.query(`
        SELECT p.*, s.nom_sta 
        FROM pro_ren p
        JOIN sta_ren s ON p.sta_pro = s.cod_sta
    `);
    return rows;
};

const getProgamModel = async ({ cod_pro }) => {
    const [rows] = await db.query(`
        SELECT p.*, s.nom_sta 
        FROM pro_ren p
        JOIN sta_ren s ON p.sta_pro = s.cod_sta
        WHERE p.cod_pro = ?
    `, [cod_pro]);
    return rows[0];
};

const createProgramModel = async ({ nom_pro, sta_pro }) => {
    const [result] = await db.query(
        'INSERT INTO pro_ren (nom_pro, sta_pro) VALUES (?, ?)',
        [nom_pro, parseInt(sta_pro)]
    );
    return { cod_pro: result.insertId, nom_pro, sta_pro };
};

const updateProgramModel = async (cod_pro, { nom_pro, sta_pro }) => {
    await db.query(
        'UPDATE pro_ren SET nom_pro=?, sta_pro=? WHERE cod_pro=?',
        [nom_pro, parseInt(sta_pro), cod_pro]
    );
    return { cod_pro, nom_pro, sta_pro };
};

const deleteProgramModel = async ({ cod_pro }) => {
    const [result] = await db.query('DELETE FROM pro_ren WHERE cod_pro=?', [cod_pro]);
    return result.affectedRows > 0;
};

export const programsModel = {
    getProgamModel,
    getProgramsModel,
    createProgramModel,
    updateProgramModel,
    deleteProgramModel,
};