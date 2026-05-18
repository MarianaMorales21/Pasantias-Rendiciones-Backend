import { db } from "../database/connection.database.js";

// Obtener todos los detalles con el número de partida
const getDebitNoteModelDetails = async () => {
    const [rows] = await db.query(`
        SELECT d.*, p.num_par 
        FROM drn_ren d
        JOIN par_ren p ON d.par_drn = p.cod_par
    `);
    return rows;
};

// Obtener detalles de una nota de débito específica
const getDetailsByDebitNoteModel = async (cod_ndb) => {
    const [rows] = await db.query(`
        SELECT d.*, p.num_par
        FROM drn_ren d
        JOIN par_ren p ON d.par_drn = p.cod_par
        WHERE d.cab_drn = ?
    `, [cod_ndb]);
    return rows;
};

// Crear detalle basado estrictamente en tu esquema SQL
const createDebitNoteModelDetails = async ({ cab_drn, par_drn, des_drn, mon_drn }) => {
    const [result] = await db.query(
        'INSERT INTO drn_ren (cab_drn, par_drn, des_drn, mon_drn) VALUES (?,?,?,?)',
        [cab_drn, par_drn, des_drn, mon_drn]
    );
    return { cod_drn: result.insertId, cab_drn, par_drn, des_drn, mon_drn };
};

// Actualizar detalle
const updateDebitNoteModelDetails = async (cod_drn, { cab_drn, par_drn, des_drn, mon_drn }) => {
    await db.query(
        'UPDATE drn_ren SET cab_drn=?, par_drn=?, des_drn=?, mon_drn=? WHERE cod_drn=?',
        [cab_drn, par_drn, des_drn, mon_drn, cod_drn]
    );
    return { cod_drn, cab_drn, par_drn, des_drn, mon_drn };
};

const deleteDebitNoteModelDetails = async ({ cod_drn }) => {
    const [result] = await db.query('DELETE FROM drn_ren WHERE cod_drn=?', [cod_drn]);
    return result.affectedRows > 0;
};

export const debitNoteDetailsModel = {
    getDebitNoteModelDetails,
    getDetailsByDebitNoteModel,
    createDebitNoteModelDetails,
    updateDebitNoteModelDetails,
    deleteDebitNoteModelDetails
};