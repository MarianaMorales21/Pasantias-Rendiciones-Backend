import { db } from "../database/connection.database.js";

// Obtener todos los detalles con el número de partida
const getDebitNoteModelDetails = async () => {
    const [rows] = await db.query(`
        SELECT d.*, p.num_par 
        FROM drn_ren d
        LEFT JOIN par_ren p ON d.par_drn = p.cod_par
    `);
    return rows;
};

// Obtener detalles de una nota de débito específica
const getDetailsByDebitNoteModel = async (cod_ndb) => {
    const [rows] = await db.query(`
        SELECT d.*, p.num_par
        FROM drn_ren d
        LEFT JOIN par_ren p ON d.par_drn = p.cod_par
        WHERE d.cab_drn = ?
    `, [cod_ndb]);
    return rows;
};

// Crear detalle basado estrictamente en tu esquema SQL
const createDebitNoteModelDetails = async ({ cab_drn, par_drn, des_drn, mon_drn }) => {
    const finalPar = par_drn || null;
    const [result] = await db.query(
        'INSERT INTO drn_ren (cab_drn, par_drn, des_drn, mon_drn) VALUES (?,?,?,?)',
        [cab_drn, finalPar, des_drn, mon_drn]
    );
    return { cod_drn: result.insertId, cab_drn, par_drn: finalPar, des_drn, mon_drn };
};

// Actualizar detalle
const updateDebitNoteModelDetails = async (cod_drn, { cab_drn, par_drn, des_drn, mon_drn }) => {
    const finalPar = par_drn || null;
    await db.query(
        'UPDATE drn_ren SET cab_drn=?, par_drn=?, des_drn=?, mon_drn=? WHERE cod_drn=?',
        [cab_drn, finalPar, des_drn, mon_drn, cod_drn]
    );
    return { cod_drn, cab_drn, par_drn: finalPar, des_drn, mon_drn };
};

const deleteDebitNoteModelDetails = async ({ cod_drn }) => {
    const [result] = await db.query('DELETE FROM drn_ren WHERE cod_drn=?', [cod_drn]);
    return result.affectedRows > 0;
};

const getDetailBudgetModel = async (cab_drn, excludedCodDrn = null) => {
    const [ndbRows] = await db.query(
        'SELECT mon_ndb, sub_ndb, rtc_ndb, tbf_ndb, isl_ndb FROM ndb_ren WHERE cod_ndb = ?',
        [cab_drn]
    );
    const debitNote = ndbRows[0];
    if (!debitNote) return null;

    let query = 'SELECT SUM(mon_drn) as totalSpent FROM drn_ren WHERE cab_drn = ?';
    const params = [cab_drn];
    if (excludedCodDrn !== null && excludedCodDrn !== undefined) {
        query += ' AND cod_drn != ?';
        params.push(excludedCodDrn);
    }
    const [detailsRows] = await db.query(query, params);
    const totalSpent = Number(detailsRows[0].totalSpent || 0);

    const hasRetention = Number(debitNote.sub_ndb) > 0 || Number(debitNote.rtc_ndb) > 0 || Number(debitNote.tbf_ndb) > 0 || Number(debitNote.isl_ndb) > 0;
    const baseAmount = hasRetention ? Number(debitNote.sub_ndb) : Number(debitNote.mon_ndb);
    const remaining = baseAmount - totalSpent;

    return {
        baseAmount,
        totalSpent,
        remaining: Math.max(0, remaining)
    };
};

export const debitNoteDetailsModel = {
    getDebitNoteModelDetails,
    getDetailsByDebitNoteModel,
    createDebitNoteModelDetails,
    updateDebitNoteModelDetails,
    deleteDebitNoteModelDetails,
    getDetailBudgetModel
};