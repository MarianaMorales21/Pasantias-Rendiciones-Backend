import { db } from "../database/connection.database.js";

const getRenditionsModel = async () => {
    const [rows] = await db.query(`
        SELECT r.*, o.num_opg, o.mon_opg, s.nom_sta
        FROM rnd_ren r
        JOIN opg_ren o ON r.opg_rnd = o.cod_opg
        JOIN sta_ren s ON r.sta_rnd = s.cod_sta
    `);
    return rows;
};

const getRenditionModel = async ({ cod_rnd }) => {
    const [rows] = await db.query(`
        SELECT r.*, o.num_opg, o.mon_opg, s.nom_sta
        FROM rnd_ren r
        JOIN opg_ren o ON r.opg_rnd = o.cod_opg
        JOIN sta_ren s ON r.sta_rnd = s.cod_sta
        WHERE r.cod_rnd=?
    `, [cod_rnd]);
    return rows[0];
};

const createRenditionModel = async ({ num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, sta_rnd, rnt_rnd }) => {
    const [result] = await db.query(
        'INSERT INTO rnd_ren (num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, sta_rnd, rnt_rnd) VALUES (?,?,?,?,?,?,?)', 
        [num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, parseInt(sta_rnd), rnt_rnd]
    );
    return { cod_rnd: result.insertId, num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, sta_rnd, rnt_rnd };
};

const updateRenditionModel = async (cod_rnd, { num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, sta_rnd, rnt_rnd }) => {
    await db.query(
        'UPDATE rnd_ren SET num_rnd=?, opg_rnd=?, fec_rnd=?, prd_rnd=?, avs_rnd=?, sta_rnd=?, rnt_rnd=? WHERE cod_rnd=?',
        [num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, parseInt(sta_rnd), rnt_rnd, cod_rnd]
    );
    return { cod_rnd, num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, sta_rnd, rnt_rnd };
};

const deleteRenditionModel = async ({ cod_rnd }) => {
    const [result] = await db.query('DELETE FROM rnd_ren WHERE cod_rnd=?', [cod_rnd]);
    return result.affectedRows > 0;
};

const getRenditionsByOpgModel = async (opg_rnd) => {
    const [rows] = await db.query(`
        SELECT r.*, o.num_opg, o.mon_opg, s.nom_sta
        FROM rnd_ren r
        JOIN opg_ren o ON r.opg_rnd = o.cod_opg
        JOIN sta_ren s ON r.sta_rnd = s.cod_sta
        WHERE r.opg_rnd = ?
    `, [opg_rnd]);
    return rows;
};

// Verificar si la rendición tiene notas de débito asociadas
const renditionHasDebitNotes = async (cod_rnd) => {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM ndb_ren WHERE rnd_ndb = ?', [cod_rnd]);
    return rows[0].count > 0;
};

// Obtener el estado de la OPG a la que pertenece la rendición
const getOPGStatus = async (opg_rnd) => {
    const [rows] = await db.query('SELECT sta_opg FROM opg_ren WHERE cod_opg = ?', [opg_rnd]);
    return rows[0];
};

// Verificar si el número de rendición ya existe en la misma OPG
const checkDuplicateNumRnd = async (num_rnd, opg_rnd, excludeCodRnd = null) => {
    const query = excludeCodRnd
        ? 'SELECT COUNT(*) as count FROM rnd_ren WHERE num_rnd = ? AND opg_rnd = ? AND cod_rnd != ?'
        : 'SELECT COUNT(*) as count FROM rnd_ren WHERE num_rnd = ? AND opg_rnd = ?';
    const params = excludeCodRnd ? [num_rnd, opg_rnd, excludeCodRnd] : [num_rnd, opg_rnd];
    const [rows] = await db.query(query, params);
    return rows[0].count > 0;
};

export const renditionModel = {
    getRenditionModel,
    getRenditionsModel,
    getRenditionsByOpgModel,
    createRenditionModel,
    updateRenditionModel,
    deleteRenditionModel,

    renditionHasDebitNotes,
    getOPGStatus,
    checkDuplicateNumRnd,
};