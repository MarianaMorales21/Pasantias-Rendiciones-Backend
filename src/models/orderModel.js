import { db } from "../database/connection.database.js";

const getOrdersModel = async () => {
    const [rows] = await db.query('SELECT * FROM opg_ren');
    return rows;
};

const getOrderModel = async ({ cod_opg }) => {
    const [rows] = await db.query('SELECT * FROM opg_ren WHERE cod_opg=?', [cod_opg]);
    return rows;
};

const createOrderModel = async ({ num_opg, ced_ctd, fec_opg, fco_opg, asp_opg, dcr_opg, fdc_opg, mon_opg, sta_opg }) =>{
    await db.query('INSERT INTO opg_ren (num_opg, ced_ctd, fec_opg, fco_opg, asp_opg, dcr_opg, fdc_opg, mon_opg, sta_opg) VALUES (?,?,?,?,?,?,?,?,?)', [num_opg, ced_ctd, fec_opg, fco_opg, asp_opg, dcr_opg, fdc_opg, mon_opg, sta_opg]);
    return { num_opg, ced_ctd, fec_opg, fco_opg, asp_opg, dcr_opg, fdc_opg, mon_opg, sta_opg };
};

const updateOrderModel = async (cod_opg, {num_opg, ced_ctd, fec_opg, fco_opg, asp_opg, dcr_opg, fdc_opg, mon_opg, sta_opg}) => {
    await db.query('UPDATE opg_ren SET num_opg=?, ced_ctd=?, fec_opg=?, fco_opg=?, asp_opg=?, dcr_opg=?, fdc_opg=?, mon_opg=?, sta_opg=? WHERE cod_opg=?', [num_opg, ced_ctd, fec_opg, fco_opg, asp_opg, dcr_opg, fdc_opg, mon_opg, sta_opg, cod_opg]);
    return { num_opg, ced_ctd, fec_opg, fco_opg, asp_opg, dcr_opg, fdc_opg, mon_opg, sta_opg, cod_opg };
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
