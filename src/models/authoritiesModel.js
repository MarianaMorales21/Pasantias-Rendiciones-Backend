import { db } from '../database/connection.database.js';

const getRanksModel = async () => {
    const [rows] = await db.query(`
        SELECT * FROM ran_ren
    `);
    return rows;
};

const getRankByIdModel = async ({ cod_ran }) => {
    const [rows] = await db.query(`
        SELECT * FROM ran_ren WHERE cod_ran=?
    `, [cod_ran]);
    return rows[0];
};

const createRankModel = async ({ nom_ran, abr_ran }) => {
    await db.query(
        'INSERT INTO ran_ren (nom_ran, abr_ran) VALUES (?,?)', 
        [nom_ran, abr_ran]
    );
    return { nom_ran, abr_ran };
};

const updateRankModel = async (cod_ran, { nom_ran, abr_ran }) => {
    await db.query(
        'UPDATE ran_ren SET nom_ran=?, abr_ran=? WHERE cod_ran=?',
        [nom_ran, abr_ran, cod_ran]
    );
    return { nom_ran, abr_ran, cod_ran };
};

const deleteRankModel = async ({ cod_ran }) => {
    const [result] = await db.query('DELETE FROM ran_ren WHERE cod_ran=?', [cod_ran]);
    return result.affectedRows > 0;
};  

const getAuthoritiesModel = async () => {
    const [rows] = await db.query(`
        SELECT ar.*, rr.nom_ran, rr.abr_ran
        FROM aut_ren ar
        JOIN ran_ren rr ON ar.pro_aut = rr.cod_ran
    `);
    return rows;
};


const getAuthorityModel = async ({ cod_aut }) => {
    const [rows] = await db.query(`
        SELECT ar.*, rr.nom_ran, rr.abr_ran
        FROM aut_ren ar
        JOIN ran_ren rr ON ar.pro_aut = rr.cod_ran
        WHERE ar.cod_aut=?
    `, [cod_aut]);
    return rows[0];
};

const createAuthorityModel = async ({ pro_aut, nom_aut, ape_aut, ran_aut, dec_aut, ced_aut }) => {
    await db.query(
        'INSERT INTO aut_ren (pro_aut, nom_aut, ape_aut, ran_aut, dec_aut, ced_aut) VALUES (?,?,?,?,?,?)', 
        [pro_aut, nom_aut, ape_aut, ran_aut, dec_aut, ced_aut]
    );
    return { pro_aut, nom_aut, ape_aut, ran_aut, dec_aut, ced_aut };
};

const updateAuthorityModel = async (cod_aut, { pro_aut, nom_aut, ape_aut, ran_aut, dec_aut, ced_aut }) => {
    await db.query(
        'UPDATE aut_ren SET pro_aut=?, nom_aut=?, ape_aut=?, ran_aut=?, dec_aut=?, ced_aut=? WHERE cod_aut=?',
        [pro_aut, nom_aut, ape_aut, ran_aut, dec_aut, ced_aut, cod_aut]
    );
    return { pro_aut, nom_aut, ape_aut, ran_aut, dec_aut, ced_aut, cod_aut };
};

const deleteAuthorityModel = async ({ cod_aut }) => {
    const [result] = await db.query('DELETE FROM aut_ren WHERE cod_aut=?', [cod_aut]);
    return result.affectedRows > 0;
};  


export const authoritiesModel = {
    getRanksModel,
    getRankByIdModel,
    createRankModel,
    updateRankModel,
    deleteRankModel,
    getAuthoritiesModel,
    getAuthorityModel,
    createAuthorityModel,
    updateAuthorityModel,
    deleteAuthorityModel,
};  
