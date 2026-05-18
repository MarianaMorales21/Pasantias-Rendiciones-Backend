import { db } from "../database/connection.database.js";

// 1. Lista de rendiciones con saldo actual (Saber cuánto queda de la OPG)
const getRenditionListModel = async () => {
    const [rows] = await db.query(`
        SELECT 
            r.cod_rnd, r.num_rnd, r.fec_rnd, r.prd_rnd,
            o.num_opg, o.mon_opg,
            (SELECT COALESCE(SUM(mon_drn), 0) FROM drn_ren d 
             JOIN ndb_ren n ON d.cab_drn = n.cod_ndb 
             WHERE n.rnd_ndb = r.cod_rnd) AS total_rendido
        FROM rnd_ren r
        JOIN opg_ren o ON r.opg_rnd = o.cod_opg
        WHERE r.sta_rnd = 1
        ORDER BY r.cod_rnd DESC
    `);
    return rows;
};

// 2. Encabezado de Reporte (Ajustado con JOIN a par_ren)
const getReportHeaderModel = async (cod_rnd) => {
    const [rows] = await db.query(`
        SELECT 
            r.cod_rnd, r.num_rnd, r.fec_rnd, r.prd_rnd, r.avs_rnd,
            o.cod_opg, o.num_opg, o.fec_opg, o.mon_opg, o.con_opg, o.fco_opg, o.dcr_opg,
            o.fdc_opg, -- Traemos la fecha de decreto si existe
            p.num_par, -- <--- ESTO ES LO QUE TE FALTA PARA LA ASIGNACIÓN
            p.nom_par,
            c.nom_ctd, c.ape_ctd, c.ced_ctd, c.dir_ctd
        FROM rnd_ren r
        JOIN opg_ren o ON r.opg_rnd = o.cod_opg
        JOIN ctd_ren c ON o.ced_opg = c.ced_ctd
        LEFT JOIN par_ren p ON o.par_opg = p.cod_par -- <--- JOIN PARA LA PARTIDA DE LA OPG
        WHERE r.cod_rnd = ?
        LIMIT 1
    `, [cod_rnd]);
    return rows[0];
};

// 3. Detalles de Gastos de una Rendición (Agrupados por Programa)
const getRenditionDetailsModel = async (cod_rnd) => {
    const [rows] = await db.query(`
        SELECT 
            n.cod_ndb, n.num_ndb, n.fec_ndb, n.ban_ndb, n.ref_ndb,
            n.con_ndb,
            b.nom_ben, b.rif_ben, b.dir_ben,
            n.mon_ndb AS mon_drn,
            pr.cod_pro, pr.nom_pro AS programa,
            GROUP_CONCAT(DISTINCT p.num_par ORDER BY p.num_par SEPARATOR ' / ') AS partida
        FROM ndb_ren n
        JOIN ben_ren b ON n.rif_ndb = b.rif_ben
        JOIN pro_ren pr ON n.pro_ndb = pr.cod_pro
        JOIN drn_ren d ON d.cab_drn = n.cod_ndb
        JOIN par_ren p ON d.par_drn = p.cod_par
        WHERE n.rnd_ndb = ?
        GROUP BY n.cod_ndb
        ORDER BY pr.cod_pro ASC, n.fec_ndb ASC
    `, [cod_rnd]);
    return rows;
};

// 4. Reporte Completo por Orden de Pago (Muestra TODAS las rendiciones de esa OPG)
const getFullOPGHistoryModel = async (cod_opg) => {
    const [rows] = await db.query(`
        SELECT 
            r.num_rnd AS rendicion_nro,
            r.prd_rnd AS periodo,
            n.num_ndb AS nota_nro,
            pr.nom_pro AS programa,
            d.des_drn AS concepto,
            d.mon_drn AS monto,
            p.num_par AS partida
        FROM opg_ren o
        JOIN rnd_ren r ON o.cod_opg = r.opg_rnd
        JOIN ndb_ren n ON r.cod_rnd = n.rnd_ndb
        JOIN drn_ren d ON n.cod_ndb = d.cab_drn
        JOIN pro_ren pr ON n.pro_ndb = pr.cod_pro
        JOIN par_ren p ON d.par_drn = p.cod_par
        WHERE o.cod_opg = ?
        ORDER BY r.num_rnd ASC, pr.cod_pro ASC
    `, [cod_opg]);
    return rows;
};

// 5. Resumen de montos ejecutados vs disponibles
const getOPGExecutionSummaryModel = async (cod_opg) => {
    const [rows] = await db.query(`
        SELECT 
            o.mon_opg AS monto_inicial,
            COALESCE(SUM(d.mon_drn), 0) AS total_ejecutado,
            (o.mon_opg - COALESCE(SUM(d.mon_drn), 0)) AS saldo_disponible
        FROM opg_ren o
        LEFT JOIN rnd_ren r ON o.cod_opg = r.opg_rnd
        LEFT JOIN ndb_ren n ON r.cod_rnd = n.rnd_ndb
        LEFT JOIN drn_ren d ON n.cod_ndb = d.cab_drn
        WHERE o.cod_opg = ?
    `, [cod_opg]);
    return rows[0];
};

const getActaDataModel = async (cod_rnd) => {
    const [rows] = await db.query(`
        SELECT 
            r.num_rnd, r.fec_rnd, r.prd_rnd, r.avs_rnd,
            o.num_opg, o.mon_opg, o.con_opg, o.fco_opg, o.dcr_opg,
            c.nom_ctd, c.ape_ctd, c.ced_ctd
        FROM rnd_ren r
        JOIN opg_ren o ON r.opg_rnd = o.cod_opg
        JOIN ctd_ren c ON o.ced_opg = c.ced_ctd
        WHERE r.cod_rnd = ?
    `, [cod_rnd]);
    return rows[0];
};

export const reportsModel = {
    getRenditionListModel,
    getReportHeaderModel,
    getRenditionDetailsModel,
    getFullOPGHistoryModel,
    getOPGExecutionSummaryModel,
    getActaDataModel
};