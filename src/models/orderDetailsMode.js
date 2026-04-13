import { db } from "../database/connection.database.js";

const getOrdersDetailsModel = async () => {
    const [rows] = await db.query('SELECT * FROM rnd_ren');
    return rows;
};

const getOrderDetailModel = async ({ cod_rnd }) => {
    const [rows] = await db.query('SELECT * FROM rnd_ren WHERE cod_ren=?', [cod_rnd]);
    return rows;
};

const createOrderDetailModel = async ({ num_rnd, cod_opg, fec_rnd, prd_rnd, avs_rnd, arn_rnd, sta_rnd}) => {
    await db.query('INSERT INTO rnd_ren (num_rnd, cod_opg, fec_rnd, prd_rnd, avs_rnd, arn_rnd, sta_rnd) VALUES (?,?,?,?,?,?,?)', [num_rnd, cod_opg, fec_rnd, prd_rnd, avs_rnd, arn_rnd, sta_rnd]);
    return { num_rnd, cod_opg, fec_rnd, prd_rnd, avs_rnd, arn_rnd, sta_rnd };
};

const updateOrderDetailModel = async (cod_rnd, { num_rnd, cod_opg, fec_rnd, prd_rnd, avs_rnd, arn_rnd, sta_rnd }) => {
    await db.query(
        'UPDATE rnd_ren SET num_rnd=?, cod_opg=?, fec_rnd=?, prd_rnd=?, avs_rnd=?, arn_rnd=?, sta_rnd=? WHERE cod_rnd=?',
        [num_rnd, cod_opg, fec_rnd, prd_rnd, avs_rnd, arn_rnd, sta_rnd, cod_rnd]
    )
    return { num_rnd, cod_opg, fec_rnd, prd_rnd, avs_rnd, arn_rnd, sta_rnd };
};

const deleteOrderDetailModel = async ({ cod_rnd }) => {
    const [result] = await db.query('DELETE FROM rnd_ren WHERE cod_rnd=?', [cod_rnd]);
    return result.affectedRows > 0;
};

export const orderDetailModel = {
    getOrderDetailModel,
    getOrdersDetailsModel,
    createOrderDetailModel,
    updateOrderDetailModel,
    deleteOrderDetailModel,
};