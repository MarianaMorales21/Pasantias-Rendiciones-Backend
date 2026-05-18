import { db } from "../database/connection.database.js"

const getBeneficiarysModel = async () => {
    const [rows] = await db.query(`
        SELECT b.*, s.nom_sta 
        FROM ben_ren b
        JOIN sta_ren s ON b.sta_ben = s.cod_sta
    `);
    return rows; 
};

const getBeneficiaryModel = async ({ rif_ben }) => {
    const [rows] = await db.query(`
        SELECT b.*, s.nom_sta 
        FROM ben_ren b
        JOIN sta_ren s ON b.sta_ben = s.cod_sta
        WHERE b.rif_ben=?
    `, [rif_ben]);
    return rows[0];
};

const createBeneficiaryModel = async ({ rif_ben, nom_ben, dir_ben, sta_ben }) => {
    await db.query('INSERT INTO ben_ren (rif_ben, nom_ben, dir_ben, sta_ben) VALUES (?,?,?,?)',
    [rif_ben, nom_ben, dir_ben, parseInt(sta_ben)]
    );
    return { rif_ben, nom_ben, dir_ben, sta_ben };
};

const updateBeneficiaryModel = async (rif_ben, { nom_ben, dir_ben, sta_ben }) => {
    await db.query(
        'UPDATE ben_ren SET nom_ben=?, dir_ben=?, sta_ben=? WHERE rif_ben=?',
        [nom_ben, dir_ben, parseInt(sta_ben), rif_ben]
    )
    return { rif_ben, nom_ben, dir_ben, sta_ben };
};

const deleteBeneficiaryModel = async ({ rif_ben }) => {
    const [result] = await db.query('DELETE FROM ben_ren WHERE rif_ben=?', [rif_ben]);
    return result.affectedRows > 0;
};

export const beneficiaryModel = {
    getBeneficiaryModel,
    getBeneficiarysModel,
    createBeneficiaryModel,
    updateBeneficiaryModel,
    deleteBeneficiaryModel,
};