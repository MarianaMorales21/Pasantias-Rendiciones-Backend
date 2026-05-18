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

const createRenditionModel = async ({ num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, sta_rnd }) => {
    const [result] = await db.query(
        'INSERT INTO rnd_ren (num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, sta_rnd) VALUES (?,?,?,?,?,?)', 
        [num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, parseInt(sta_rnd)]
    );
    return { cod_rnd: result.insertId, num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, sta_rnd };
};

const updateRenditionModel = async (cod_rnd, { num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, sta_rnd }) => {
    await db.query(
        'UPDATE rnd_ren SET num_rnd=?, opg_rnd=?, fec_rnd=?, prd_rnd=?, avs_rnd=?, sta_rnd=? WHERE cod_rnd=?',
        [num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, parseInt(sta_rnd), cod_rnd]
    );
    return { cod_rnd, num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, sta_rnd };
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

export const renditionModel = {
    getRenditionModel,
    getRenditionsModel,
    getRenditionsByOpgModel,
    createRenditionModel,
    updateRenditionModel,
    deleteRenditionModel,
};