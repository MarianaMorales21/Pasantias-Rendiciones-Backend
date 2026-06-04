import { db } from "../database/connection.database.js"

const getBeneficiarysModel = async () => {
    const [rows] = await db.query(`
        SELECT b.*, s.nom_sta 
        FROM ben_ren b
        JOIN sta_ren s ON b.sta_ben = s.cod_sta
    `);
    return rows; 
};

const getBeneficiaryModel = async ({ cod_ben, rif_ben }) => {
    let query, params;
    if (cod_ben) {
        query = `SELECT b.*, s.nom_sta FROM ben_ren b JOIN sta_ren s ON b.sta_ben = s.cod_sta WHERE b.cod_ben=?`;
        params = [cod_ben];
    } else if (rif_ben) {
        query = `SELECT b.*, s.nom_sta FROM ben_ren b JOIN sta_ren s ON b.sta_ben = s.cod_sta WHERE b.rif_ben=?`;
        params = [rif_ben];
    }
    const [rows] = await db.query(query, params);
    return rows[0];
};

const createBeneficiaryModel = async ({ rif_ben, nom_ben, dir_ben, sta_ben }) => {
    const [result] = await db.query('INSERT INTO ben_ren (rif_ben, nom_ben, dir_ben, sta_ben) VALUES (?,?,?,?)',
    [rif_ben, nom_ben, dir_ben, parseInt(sta_ben)]
    );
    return { cod_ben: result.insertId, rif_ben, nom_ben, dir_ben, sta_ben };
};

const updateBeneficiaryModel = async (cod_ben, { rif_ben, nom_ben, dir_ben, sta_ben }) => {
    await db.query(
        'UPDATE ben_ren SET rif_ben=?, nom_ben=?, dir_ben=?, sta_ben=? WHERE cod_ben=?',
        [rif_ben, nom_ben, dir_ben, parseInt(sta_ben), cod_ben]
    )
    return { cod_ben, rif_ben, nom_ben, dir_ben, sta_ben };
};

const deleteBeneficiaryModel = async ({ cod_ben }) => {
    const [result] = await db.query('DELETE FROM ben_ren WHERE cod_ben=?', [cod_ben]);
    return result.affectedRows > 0;
};

export const beneficiaryModel = {
    getBeneficiaryModel,
    getBeneficiarysModel,
    createBeneficiaryModel,
    updateBeneficiaryModel,
    deleteBeneficiaryModel,
};
