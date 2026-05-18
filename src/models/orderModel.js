import { db } from "../database/connection.database.js";

const getOrdersModel = async () => {
    const [rows] = await db.query(`
        SELECT 
            o.*, 
            c.nom_ctd, 
            c.ape_ctd, 
            s.nom_sta, 
            p.num_par, 
            p.nom_par,
            b.rif_ben,
            b.nom_ben,
            b.dir_ben
        FROM opg_ren o
        LEFT JOIN ctd_ren c ON o.ced_opg = c.ced_ctd
        LEFT JOIN sta_ren s ON o.sta_opg = s.cod_sta
        LEFT JOIN par_ren p ON o.par_opg = p.cod_par
        LEFT JOIN rnd_ren r ON r.opg_rnd = o.cod_opg
        LEFT JOIN ndb_ren n ON n.rnd_ndb = r.cod_rnd
        LEFT JOIN ben_ren b ON n.rif_ndb = b.rif_ben
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
            p.nom_par,
            b.rif_ben,
            b.nom_ben,
            b.dir_ben
        FROM opg_ren o
        LEFT JOIN ctd_ren c ON o.ced_opg = c.ced_ctd
        LEFT JOIN sta_ren s ON o.sta_opg = s.cod_sta
        LEFT JOIN par_ren p ON o.par_opg = p.cod_par
        LEFT JOIN rnd_ren r ON r.opg_rnd = o.cod_opg
        LEFT JOIN ndb_ren n ON n.rnd_ndb = r.cod_rnd
        LEFT JOIN ben_ren b ON n.rif_ndb = b.rif_ben
        WHERE o.cod_opg = ?
    `, [cod_opg]);
    return rows[0];
};


const createOrderModel = async ({ 
    num_opg, ced_opg, fec_opg, fco_opg, fdc_opg, dcr_opg, 
    mon_opg, con_opg, sta_opg, par_opg 
}) =>{
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

export const orderModel = {
    getOrderModel,
    getOrdersModel,
    createOrderModel,
    updateOrderModel,
    deleteOrderModel,
};
