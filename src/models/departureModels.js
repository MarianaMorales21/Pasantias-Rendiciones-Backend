import { db } from "../database/connection.database.js";

const getDeparturesModel = async () => {
    const [rows] = await db.query('SELECT * FROM par_ren');
    return rows;
};

const getDepartureModel = async ({ cod_par }) => {
    const [rows] = await db.query('SELECT * FROM par_ren WHERE cod_par=?', [cod_par]);
    return rows[0];
};

const createDepartureModel = async ({ num_par, nom_par }) => {
    const [result] = await db.query('INSERT INTO par_ren (num_par, nom_par) VALUES (?, ?)', [num_par, nom_par]);
    return {
        cod_par: result.insertId,
        num_par: num_par,
        nom_par: nom_par
    };
};


const updateDepartureModel = async (cod_par, { num_par, nom_par }) => {
    await db.query('UPDATE par_ren SET num_par=?, nom_par=? WHERE cod_par=?', [num_par, nom_par, cod_par]);
    return { cod_par, num_par, nom_par };
};

const deleteDepartureModel = async ({ cod_par }) => {
    const [result] = await db.query('DELETE FROM par_ren WHERE cod_par=?', [cod_par]);
    return result.affectedRows > 0;
};

export const departureModel = {
    getDepartureModel,
    getDeparturesModel,
    createDepartureModel,
    updateDepartureModel,
    deleteDepartureModel,
};
