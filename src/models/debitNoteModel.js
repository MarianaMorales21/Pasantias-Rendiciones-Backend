import { db } from "../database/connection.database.js";

const getDebitNotesModel = async () => {
    const [rows] = await db.query(`
        SELECT n.*, b.nom_ben FROM ndb_ren n
        LEFT JOIN ben_ren b ON n.rif_ndb = b.rif_ben
    `);
    return rows;
};

const getDebitNotesByRenditionModel = async (rnd_ndb) => {
    const [rows] = await db.query(`
        SELECT n.*, b.nom_ben FROM ndb_ren n
        LEFT JOIN ben_ren b ON n.rif_ndb = b.rif_ben
        WHERE n.rnd_ndb = ?
    `, [rnd_ndb]);
    return rows;
};

const getDebitNoteModel = async ({ cod_ndb }) => {
    const [rows] = await db.query(`
        SELECT * FROM ndb_ren WHERE cod_ndb=?
    `, [cod_ndb]);
    return rows[0];
};

const getDebitNoteBudgetModel = async (rnd_ndb, excludedCodNdb = null) => {
    const [rows] = await db.query(`
        SELECT
            o.mon_opg AS order_amount,
            COALESCE(SUM(n.mon_ndb), 0) AS total_notes
        FROM rnd_ren selected_rnd
        JOIN opg_ren o ON selected_rnd.opg_rnd = o.cod_opg
        LEFT JOIN rnd_ren related_rnd ON related_rnd.opg_rnd = o.cod_opg
        LEFT JOIN ndb_ren n
            ON n.rnd_ndb = related_rnd.cod_rnd
            AND (? IS NULL OR n.cod_ndb <> ?)
        WHERE selected_rnd.cod_rnd = ?
        GROUP BY o.mon_opg
    `, [excludedCodNdb, excludedCodNdb, rnd_ndb]);

    const budget = rows[0];
    if (!budget) return null;

    const orderAmount = Number(budget.order_amount);
    const totalNotes = Number(budget.total_notes);

    return {
        orderAmount,
        totalNotes,
        remaining: orderAmount - totalNotes
    };
};

const createDebitNoteModel = async ({ num_ndb, fec_ndb, rif_ndb, rnd_ndb, con_ndb, mon_ndb, ban_ndb, ref_ndb, pro_ndb}) => {
    const [result] = await db.query(
        'INSERT INTO ndb_ren (num_ndb, fec_ndb, rif_ndb, rnd_ndb, con_ndb, mon_ndb, ban_ndb, ref_ndb, pro_ndb) VALUES (?,?,?,?,?,?,?,?,?)',
        [num_ndb, fec_ndb, rif_ndb, rnd_ndb, con_ndb, mon_ndb, ban_ndb, ref_ndb, pro_ndb]
    );
    return { cod_ndb: result.insertId, num_ndb, fec_ndb, rif_ndb, rnd_ndb, con_ndb, mon_ndb, ban_ndb, ref_ndb, pro_ndb };
};

const updateDebitNoteModel = async (cod_ndb, { num_ndb, fec_ndb, rif_ndb, rnd_ndb, con_ndb, mon_ndb, ban_ndb, ref_ndb, pro_ndb }) => {
    await db.query(
        'UPDATE ndb_ren SET num_ndb=?, fec_ndb=?, rif_ndb=?, rnd_ndb=?, con_ndb=?, mon_ndb=?, ban_ndb=?, ref_ndb=?, pro_ndb=? WHERE cod_ndb=?',
        [num_ndb, fec_ndb, rif_ndb, rnd_ndb, con_ndb, mon_ndb, ban_ndb, ref_ndb, pro_ndb, cod_ndb]
    );
    return { cod_ndb, num_ndb, fec_ndb, rif_ndb, rnd_ndb, con_ndb, mon_ndb, ban_ndb, ref_ndb, pro_ndb };
};

const deleteDebitNoteModel = async ({ cod_ndb }) => {
    const [result] = await db.query('DELETE FROM ndb_ren WHERE cod_ndb=?', [cod_ndb]);
    return result.affectedRows > 0;
};

export const debitNoteModel = {
    getDebitNoteModel,
    getDebitNotesModel,
    getDebitNotesByRenditionModel,
    getDebitNoteBudgetModel,
    createDebitNoteModel,
    updateDebitNoteModel,
    deleteDebitNoteModel,
};
