import { db } from "../database/connection.database.js";

const getDebitNotesModel = async () => {
    const [rows] = await db.query(`
        SELECT n.*, b.nom_ben,
            (SELECT COALESCE(SUM(mon_drn), 0) FROM drn_ren WHERE cab_drn = n.cod_ndb) AS total_details
        FROM ndb_ren n
        LEFT JOIN ben_ren b ON n.rif_ndb = b.rif_ben
    `);
    return rows;
};

const getDebitNotesByRenditionModel = async (rnd_ndb) => {
    const [rows] = await db.query(`
        SELECT n.*, b.nom_ben,
            (SELECT COALESCE(SUM(mon_drn), 0) FROM drn_ren WHERE cab_drn = n.cod_ndb) AS total_details
        FROM ndb_ren n
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
    // 1. Obtener la rendición seleccionada y el monto de su OPG
    const [rndRows] = await db.query(`
        SELECT r.cod_rnd, r.opg_rnd, o.mon_opg
        FROM rnd_ren r
        JOIN opg_ren o ON r.opg_rnd = o.cod_opg
        WHERE r.cod_rnd = ?
    `, [rnd_ndb]);

    const selectedRnd = rndRows[0];
    if (!selectedRnd) return null;

    const opgId = selectedRnd.opg_rnd;
    const orderAmount = Number(selectedRnd.mon_opg || 0);

    // 2. Obtener todas las rendiciones de esta OPG
    const [allRnds] = await db.query(`
        SELECT cod_rnd, rnt_rnd
        FROM rnd_ren
        WHERE opg_rnd = ?
    `, [opgId]);

    // Ordenar cronológicamente por cod_rnd
    const sortedRnds = [...allRnds].sort((a, b) => a.cod_rnd - b.cod_rnd);
    const currentIndex = sortedRnds.findIndex(r => r.cod_rnd === selectedRnd.cod_rnd);
    const sliceIndex = currentIndex !== -1 ? currentIndex : sortedRnds.length;

    // Rendiciones anteriores
    const previousRndIds = sortedRnds.slice(0, sliceIndex).map(r => r.cod_rnd);

    // 3. Obtener todas las notas de débito para las rendiciones de esta OPG
    const rndIds = sortedRnds.map(r => r.cod_rnd);
    if (rndIds.length === 0) {
        return {
            orderAmount,
            totalNotes: 0,
            remaining: orderAmount
        };
    }

    let notesQuery = `
        SELECT cod_ndb, rnd_ndb, mon_ndb
        FROM ndb_ren
        WHERE rnd_ndb IN (?)
    `;
    const queryParams = [rndIds];

    if (excludedCodNdb !== null && excludedCodNdb !== undefined) {
        notesQuery += ` AND cod_ndb <> ?`;
        queryParams.push(excludedCodNdb);
    }

    const [notesRows] = await db.query(notesQuery, queryParams);

    // Monto rendido en rendiciones anteriores
    const previousSpent = notesRows
        .filter(note => previousRndIds.includes(note.rnd_ndb))
        .reduce((acc, curr) => acc + Number(curr.mon_ndb || 0), 0);

    // Reintegros de rendiciones anteriores
    const previousReintegros = sortedRnds
        .slice(0, sliceIndex)
        .reduce((acc, curr) => acc + Number(curr.rnt_rnd || 0), 0);

    // Reintegro de la rendición actual
    const currentRndObj = sortedRnds.find(r => r.cod_rnd === selectedRnd.cod_rnd);
    const currentReintegro = Number(currentRndObj?.rnt_rnd || 0);

    // Monto máximo disponible para la rendición actual (incluye el reintegro actual)
    const maxAvailable = orderAmount - previousSpent + previousReintegros + currentReintegro;

    // Monto gastado en la rendición actual (excluyendo la nota que se edita)
    const currentSpent = notesRows
        .filter(note => note.rnd_ndb === selectedRnd.cod_rnd)
        .reduce((acc, curr) => acc + Number(curr.mon_ndb || 0), 0);

    const remaining = maxAvailable - currentSpent;

    return {
        orderAmount,
        totalNotes: previousSpent + currentSpent,
        remaining: Math.max(0, remaining)
    };
};

const createDebitNoteModel = async ({ num_ndb, fec_ndb, rif_ndb, rnd_ndb, con_ndb, mon_ndb, ban_ndb, ref_ndb, pro_ndb, rtc_ndb, tbf_ndb, isl_ndb, sub_ndb }) => {
    const [result] = await db.query(
        'INSERT INTO ndb_ren (num_ndb, fec_ndb, rif_ndb, rnd_ndb, con_ndb, mon_ndb, ban_ndb, ref_ndb, pro_ndb, rtc_ndb, tbf_ndb, isl_ndb, sub_ndb) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [num_ndb, fec_ndb, rif_ndb, rnd_ndb, con_ndb, mon_ndb, ban_ndb, ref_ndb, pro_ndb, rtc_ndb, tbf_ndb, isl_ndb, sub_ndb]
    );
    return { cod_ndb: result.insertId, num_ndb, fec_ndb, rif_ndb, rnd_ndb, con_ndb, mon_ndb, ban_ndb, ref_ndb, pro_ndb, rtc_ndb, tbf_ndb, isl_ndb, sub_ndb };
};

const updateDebitNoteModel = async (cod_ndb, { num_ndb, fec_ndb, rif_ndb, rnd_ndb, con_ndb, mon_ndb, ban_ndb, ref_ndb, pro_ndb, rtc_ndb, tbf_ndb, isl_ndb, sub_ndb }) => {
    await db.query(
        'UPDATE ndb_ren SET num_ndb=?, fec_ndb=?, rif_ndb=?, rnd_ndb=?, con_ndb=?, mon_ndb=?, ban_ndb=?, ref_ndb=?, pro_ndb=?, rtc_ndb=?, tbf_ndb=?, isl_ndb=?, sub_ndb=? WHERE cod_ndb=?',
        [num_ndb, fec_ndb, rif_ndb, rnd_ndb, con_ndb, mon_ndb, ban_ndb, ref_ndb, pro_ndb, rtc_ndb, tbf_ndb, isl_ndb, sub_ndb, cod_ndb]
    );
    return { cod_ndb, num_ndb, fec_ndb, rif_ndb, rnd_ndb, con_ndb, mon_ndb, ban_ndb, ref_ndb, pro_ndb, rtc_ndb, tbf_ndb, isl_ndb, sub_ndb };
};

const deleteDebitNoteModel = async ({ cod_ndb }) => {
    const [result] = await db.query('DELETE FROM ndb_ren WHERE cod_ndb=?', [cod_ndb]);
    return result.affectedRows > 0;
};

// Verificar si num_ndb ya existe (excluir cod_ndb en actualizaciones)
const checkDuplicateNumNdb = async (num_ndb, excludeCodNdb = null) => {
    const query = excludeCodNdb
        ? 'SELECT COUNT(*) as count FROM ndb_ren WHERE num_ndb = ? AND cod_ndb != ?'
        : 'SELECT COUNT(*) as count FROM ndb_ren WHERE num_ndb = ?';
    const params = excludeCodNdb ? [num_ndb, excludeCodNdb] : [num_ndb];
    const [rows] = await db.query(query, params);
    return rows[0].count > 0;
};

// Verificar si la nota de débito tiene detalles asociados
const debitNoteHasDetails = async (cod_ndb) => {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM drn_ren WHERE cab_drn = ?', [cod_ndb]);
    return rows[0].count > 0;
};

export const debitNoteModel = {
    getDebitNoteModel,
    getDebitNotesModel,
    getDebitNotesByRenditionModel,
    getDebitNoteBudgetModel,
    createDebitNoteModel,
    updateDebitNoteModel,
    deleteDebitNoteModel,
    checkDuplicateNumNdb,
    debitNoteHasDetails,
};
