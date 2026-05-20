import { db } from "../database/connection.database.js";

// 1. Lista de rendiciones con saldo actual (Saber cuánto queda de la OPG)
const getRenditionListModel = async () => {
    const [rows] = await db.query(`
        SELECT 
            r.cod_rnd, r.num_rnd, r.fec_rnd, r.prd_rnd, r.rnt_rnd,
            o.cod_opg, o.num_opg, o.mon_opg,
            COALESCE((
                SELECT SUM(d.mon_drn) 
                FROM drn_ren d 
                JOIN ndb_ren n ON d.cab_drn = n.cod_ndb 
                WHERE n.rnd_ndb = r.cod_rnd
            ), 0) AS total_rendido
        FROM rnd_ren r
        JOIN opg_ren o ON r.opg_rnd = o.cod_opg
        WHERE r.sta_rnd = 1
        ORDER BY o.cod_opg ASC, r.cod_rnd ASC
    `);
    return rows;
};

// 2. Encabezado de Reporte (Ajustado con JOIN a par_ren)
const getReportHeaderModel = async (cod_rnd) => {
    const [rows] = await db.query(`
        SELECT 
            r.cod_rnd, r.num_rnd, r.fec_rnd, r.prd_rnd, r.avs_rnd, r.rnt_rnd,
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
            n.cod_ndb,
            n.num_ndb,
            n.fec_ndb,
            n.ban_ndb,
            n.ref_ndb,
            n.con_ndb,
            b.nom_ben,
            b.rif_ben,
            b.dir_ben,
            n.mon_ndb AS mon_drn,
            pr.cod_pro,
            pr.nom_pro AS programa,
            GROUP_CONCAT(DISTINCT p.num_par ORDER BY p.num_par SEPARATOR ' / ') AS partida
        FROM ndb_ren n
        JOIN ben_ren b ON n.rif_ndb = b.rif_ben
        JOIN pro_ren pr ON n.pro_ndb = pr.cod_pro

        -- 🔥 CLAVE: asegurar aislamiento antes de expandir
        JOIN drn_ren d ON d.cab_drn = n.cod_ndb

        LEFT JOIN par_ren p ON p.cod_par = d.par_drn

        WHERE n.rnd_ndb = ?
        GROUP BY 
            n.cod_ndb,
            n.num_ndb,
            n.fec_ndb,
            n.ban_ndb,
            n.ref_ndb,
            n.con_ndb,
            b.nom_ben,
            b.rif_ben,
            b.dir_ben,
            n.mon_ndb,
            pr.cod_pro,
            pr.nom_pro
        ORDER BY pr.cod_pro ASC, n.fec_ndb ASC;
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
        LEFT JOIN par_ren p ON d.par_drn = p.cod_par
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
            
            -- Total de reintegros de la OPG
            COALESCE((
                SELECT SUM(COALESCE(r2.rnt_rnd, 0)) 
                FROM rnd_ren r2 
                WHERE r2.opg_rnd = o.cod_opg
            ), 0) AS total_reintegros,
            
            -- Bruto de gastos
            COALESCE(SUM(d.mon_drn), 0) AS bruto_ejecutado,
            
            -- Neto ejecutado = bruto - reintegros
            (COALESCE(SUM(d.mon_drn), 0) - COALESCE((
                SELECT SUM(COALESCE(r2.rnt_rnd, 0)) 
                FROM rnd_ren r2 
                WHERE r2.opg_rnd = o.cod_opg
            ), 0)) AS total_ejecutado,
            
            -- Saldo disponible = inicial - neto ejecutado
            (o.mon_opg - (COALESCE(SUM(d.mon_drn), 0) - COALESCE((
                SELECT SUM(COALESCE(r2.rnt_rnd, 0)) 
                FROM rnd_ren r2 
                WHERE r2.opg_rnd = o.cod_opg
            ), 0))) AS saldo_disponible,
            
            (SELECT COUNT(r.cod_rnd) FROM rnd_ren r WHERE r.opg_rnd = o.cod_opg) AS total_rendiciones
        FROM opg_ren o
        LEFT JOIN rnd_ren r ON o.cod_opg = r.opg_rnd
        LEFT JOIN ndb_ren n ON r.cod_rnd = n.rnd_ndb
        LEFT JOIN drn_ren d ON n.cod_ndb = d.cab_drn
        WHERE o.cod_opg = ?
        GROUP BY o.cod_opg
    `, [cod_opg]);
    return rows[0];
};

const getOPGExecutionByRenditionModel = async (cod_rnd) => {
    const [rows] = await db.query(`
        SELECT 
            o.mon_opg AS monto_asignado,

            COALESCE((
                SELECT SUM(d.mon_drn)
                FROM ndb_ren n
                JOIN drn_ren d ON d.cab_drn = n.cod_ndb
                WHERE n.rnd_ndb = r.cod_rnd
            ),0) AS monto_rendido_actual,

            COALESCE((
                SELECT SUM(d.mon_drn)
                FROM ndb_ren n
                JOIN drn_ren d ON d.cab_drn = n.cod_ndb
                JOIN rnd_ren r2 ON n.rnd_ndb = r2.cod_rnd
                WHERE r2.opg_rnd = o.cod_opg
                  AND r2.num_rnd < r.num_rnd
            ),0) AS monto_rendido_anterior

        FROM rnd_ren r
        JOIN opg_ren o ON r.opg_rnd = o.cod_opg
        WHERE r.cod_rnd = ?
    `, [cod_rnd]);

    return rows[0] || null;
};

const getActaDataModel = async (cod_rnd) => {
    const [rows] = await db.query(`
        SELECT 
            r.num_rnd, r.fec_rnd, r.prd_rnd, r.avs_rnd, r.rnt_rnd,
            o.cod_opg, o.num_opg, o.mon_opg, o.con_opg, o.fco_opg, o.dcr_opg,
            c.nom_ctd, c.ape_ctd, c.ced_ctd
        FROM rnd_ren r
        JOIN opg_ren o ON r.opg_rnd = o.cod_opg
        JOIN ctd_ren c ON o.ced_opg = c.ced_ctd
        WHERE r.cod_rnd = ?
    `, [cod_rnd]);
    return rows[0];
};

const getDashboardProgramStatsModel = async () => {
    // Current year and month
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const [rows] = await db.query(`
        SELECT 
            p.cod_pro,
            p.nom_pro,
            COALESCE(SUM(CASE WHEN YEAR(n.fec_ndb) = ? THEN d.mon_drn ELSE 0 END), 0) as gastado_anual,
            COALESCE(SUM(CASE WHEN YEAR(n.fec_ndb) = ? AND MONTH(n.fec_ndb) = ? THEN d.mon_drn ELSE 0 END), 0) as gastado_mensual
        FROM pro_ren p
        LEFT JOIN ndb_ren n ON p.cod_pro = n.pro_ndb
        LEFT JOIN drn_ren d ON n.cod_ndb = d.cab_drn
        GROUP BY p.cod_pro, p.nom_pro
    `, [year, year, month]);
    return rows;
};

const getDetailedReportCalculationsModel = async (cod_rnd, cod_opg) => {
    // 1. Obtener todas las rendiciones de esta OPG
    const [allRnds] = await db.query(`
        SELECT cod_rnd, rnt_rnd
        FROM rnd_ren
        WHERE opg_rnd = ?
    `, [cod_opg]);

    // Ordenar por ID para orden cronológico
    const sortedRnds = [...allRnds].sort((a, b) => a.cod_rnd - b.cod_rnd);
    const currentIndex = sortedRnds.findIndex(r => r.cod_rnd === Number(cod_rnd));
    const sliceIndex = currentIndex !== -1 ? currentIndex : sortedRnds.length;

    // Rendiciones anteriores
    const previousRndIds = sortedRnds.slice(0, sliceIndex).map(r => r.cod_rnd);

    // 2. Obtener gastos de rendiciones anteriores
    let previousSpent = 0;
    if (previousRndIds.length > 0) {
        const [spentRow] = await db.query(`
            SELECT COALESCE(SUM(d.mon_drn), 0) AS total
            FROM drn_ren d
            JOIN ndb_ren n ON d.cab_drn = n.cod_ndb
            WHERE n.rnd_ndb IN (?)
        `, [previousRndIds]);
        previousSpent = parseFloat(spentRow[0].total);
    }

    // 3. Obtener reintegro acumulado anterior
    const previousReintegros = sortedRnds.slice(0, sliceIndex).reduce((acc, r) => acc + parseFloat(r.rnt_rnd || 0), 0);

    return {
        previousSpent,
        previousReintegros
    };
};

const getOPGRenditionsProgressModel = async (cod_opg, monOpg) => {
    const [rows] = await db.query(`
        SELECT 
            r.cod_rnd,
            r.num_rnd,
            COALESCE(r.rnt_rnd, 0) AS reintegro,
            COALESCE(SUM(d.mon_drn), 0) AS monto_rendido
        FROM rnd_ren r
        LEFT JOIN ndb_ren n ON r.cod_rnd = n.rnd_ndb
        LEFT JOIN drn_ren d ON n.cod_ndb = d.cab_drn
        WHERE r.opg_rnd = ?
        GROUP BY r.cod_rnd, r.num_rnd, r.rnt_rnd
        ORDER BY r.num_rnd ASC
    `, [cod_opg]);

    let netAccum = 0;
    return rows.map((row) => {
        const rnt = Number(row.reintegro);
        const rendido = Number(row.monto_rendido);
        netAccum += (rendido - rnt);
        const porcentaje = monOpg > 0 ? (netAccum * 100) / monOpg : 0;
        const sobrante = monOpg - netAccum;
        return {
            cod_rnd: row.cod_rnd,
            num_rnd: row.num_rnd,
            monto_rendido: rendido,
            reintegro: rnt,
            porcentaje: parseFloat(porcentaje.toFixed(2)),
            sobrante: parseFloat(sobrante.toFixed(2))
        };
    });
};

export const reportsModel = {
    getRenditionListModel,
    getReportHeaderModel,
    getRenditionDetailsModel,
    getFullOPGHistoryModel,
    getOPGExecutionSummaryModel,
    getActaDataModel,
    getDashboardProgramStatsModel,
    getOPGExecutionByRenditionModel,
    getDetailedReportCalculationsModel,
    getOPGRenditionsProgressModel,
};