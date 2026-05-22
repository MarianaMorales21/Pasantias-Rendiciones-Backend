import { db } from "../database/connection.database.js";

const getOrdersModel = async () => {
    const [rows] = await db.query(`
        SELECT 
            o.*, 
            c.nom_ctd, 
            c.ape_ctd, 
            s.nom_sta, 
            p.num_par, 
            p.nom_par
        FROM opg_ren o
        LEFT JOIN ctd_ren c ON o.ced_opg = c.ced_ctd
        LEFT JOIN sta_ren s ON o.sta_opg = s.cod_sta
        LEFT JOIN par_ren p ON o.par_opg = p.cod_par
    `);
    return rows;
};

const getOrderModel = async ({ cod_opg }) => {
    const [rows] = await db.query(`
        SELECT 
            o.*, 
            c.nom_ctd, 
            c.ape_ctd, 
            s.nom_sta, 
            p.num_par, 
            p.nom_par
        FROM opg_ren o
        LEFT JOIN ctd_ren c ON o.ced_opg = c.ced_ctd
        LEFT JOIN sta_ren s ON o.sta_opg = s.cod_sta
        LEFT JOIN par_ren p ON o.par_opg = p.cod_par
        WHERE o.cod_opg = ?
    `, [cod_opg]);
    return rows[0];
};

// Verificar si num_opg ya existe (excluir cod_opg en actualizaciones)
const checkDuplicateNumOpg = async (num_opg, excludeCodOpg = null) => {
    const query = excludeCodOpg
        ? 'SELECT COUNT(*) as count FROM opg_ren WHERE num_opg = ? AND cod_opg != ?'
        : 'SELECT COUNT(*) as count FROM opg_ren WHERE num_opg = ?';
    const params = excludeCodOpg ? [num_opg, excludeCodOpg] : [num_opg];
    const [rows] = await db.query(query, params);
    return rows[0].count > 0;
};

// Verificar si la OPG tiene rendiciones asociadas
const opgHasRenditions = async (cod_opg) => {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM rnd_ren WHERE opg_rnd = ?', [cod_opg]);
    return rows[0].count > 0;
};

// Verificar si la OPG tiene notas de débito asociadas en alguna rendición
const opgHasDebitNotes = async (cod_opg) => {
    const [rows] = await db.query(`
        SELECT COUNT(n.cod_ndb) as count 
        FROM ndb_ren n
        JOIN rnd_ren r ON n.rnd_ndb = r.cod_rnd
        WHERE r.opg_rnd = ?
    `, [cod_opg]);
    return rows[0].count > 0;
};

const createOrderModel = async ({ 
    num_opg, ced_opg, fec_opg, fco_opg, fdc_opg, dcr_opg, 
    mon_opg, con_opg, sta_opg, par_opg 
}) => {
    const [result] = await db.query(
        `INSERT INTO opg_ren 
        (num_opg, ced_opg, fec_opg, fco_opg, fdc_opg, dcr_opg, mon_opg, con_opg, sta_opg, par_opg) 
        VALUES (?,?,?,?,?,?,?,?,?,?)`, 
        [num_opg, ced_opg, fec_opg, fco_opg, fdc_opg, dcr_opg, mon_opg, con_opg, parseInt(sta_opg), par_opg]
    );
    return { 
        cod_opg: result.insertId, num_opg, ced_opg, fec_opg, 
        fco_opg, fdc_opg, dcr_opg, mon_opg, con_opg, sta_opg, par_opg 
    };
};

const updateOrderModel = async (cod_opg, { 
    num_opg, ced_opg, fec_opg, fco_opg, fdc_opg, dcr_opg, 
    mon_opg, con_opg, sta_opg, par_opg 
}) => {
    await db.query(
        `UPDATE opg_ren SET 
        num_opg=?, ced_opg=?, fec_opg=?, fco_opg=?, fdc_opg=?, dcr_opg=?, 
        mon_opg=?, con_opg=?, sta_opg=?, par_opg=? 
        WHERE cod_opg=?`, 
        [num_opg, ced_opg, fec_opg, fco_opg, fdc_opg, dcr_opg, mon_opg, con_opg, parseInt(sta_opg), par_opg, cod_opg]
    );
    return { 
        cod_opg, num_opg, ced_opg, fec_opg, fco_opg, 
        fdc_opg, dcr_opg, mon_opg, con_opg, sta_opg, par_opg 
    };
};

const deleteOrderModel = async ({ cod_opg }) => {
    const [result] = await db.query('DELETE FROM opg_ren WHERE cod_opg=?', [cod_opg]);
    return result.affectedRows > 0;
};

// Obtener el monto neto gastado (notas de débito - reintegros) de la OPG
const getOpgNetSpent = async (cod_opg) => {
    const [notes] = await db.query(`
        SELECT COALESCE(SUM(n.mon_ndb), 0) as total_spent
        FROM ndb_ren n
        JOIN rnd_ren r ON n.rnd_ndb = r.cod_rnd
        WHERE r.opg_rnd = ?
    `, [cod_opg]);

    const [refunds] = await db.query(`
        SELECT COALESCE(SUM(r.rnt_rnd), 0) as total_refunds
        FROM rnd_ren r
        WHERE r.opg_rnd = ?
    `, [cod_opg]);

    const spent = Number(notes[0].total_spent);
    const refundsVal = Number(refunds[0].total_refunds);
    return Math.max(0, spent - refundsVal);
};

const autoUpdateOpgStatus = async (cod_opg) => {
    if (!cod_opg) return;

    const [[pagadoRow], [pendienteRow]] = await Promise.all([
        db.query('SELECT cod_sta FROM sta_ren WHERE nom_sta = ?', ['Pagado']),
        db.query('SELECT cod_sta FROM sta_ren WHERE nom_sta = ?', ['Pendiente'])
    ]);

    const PAGADO_ID = pagadoRow[0]?.cod_sta;
    const PENDIENTE_ID = pendienteRow[0]?.cod_sta;
    if (!PAGADO_ID || !PENDIENTE_ID) return;

    const [opgRows] = await db.query('SELECT mon_opg FROM opg_ren WHERE cod_opg = ?', [cod_opg]);
    if (!opgRows[0]) return;
    const mon_opg = Number(opgRows[0].mon_opg);

    const netSpent = await getOpgNetSpent(cod_opg);
    const newStatusId = netSpent >= mon_opg ? PAGADO_ID : PENDIENTE_ID;

    await db.query('UPDATE opg_ren SET sta_opg = ? WHERE cod_opg = ?', [newStatusId, cod_opg]);
};

export const orderModel = {
    getOrderModel,
    getOrdersModel,
    createOrderModel,
    updateOrderModel,
    deleteOrderModel,
    checkDuplicateNumOpg,
    opgHasRenditions,
    opgHasDebitNotes,
    getOpgNetSpent,
    autoUpdateOpgStatus,
};
