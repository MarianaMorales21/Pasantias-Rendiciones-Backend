import { db } from "../database/connection.database.js";

const getUsersModel = async () => {
    // En MySQL2, db.query devuelve [filas, metadatos]
    const [rows] = await db.query('SELECT * FROM usu_ren');
    return rows;
}

const getUserModel = async ({ ced_usu }) => {
    const [rows] = await db.query('SELECT * FROM usu_ren WHERE ced_usu = ?', [ced_usu]);
    return rows[0]; // Retornamos el primer usuario encontrado
}

const createUserModel = async ({ ced_usu, nom_usu, cla_usu, sta_usu }) => {
    // MySQL no tiene RETURNING. Primero insertamos y luego si quieres devuelves los datos.
    await db.query(
        'INSERT INTO usu_ren (ced_usu, nom_usu, cla_usu, sta_usu) VALUES (?, ?, ?, ?)',
        [ced_usu, nom_usu, cla_usu, sta_usu]
    );
    return { ced_usu, nom_usu, sta_usu }; 
}

const updateUserModel = async (ced_usu, { nom_usu, cla_usu, sta_usu }) => {
    await db.query(
        'UPDATE usu_ren SET nom_usu=?, cla_usu=?, sta_usu=? WHERE ced_usu=?',
        [nom_usu, cla_usu, sta_usu, ced_usu]
    );
    return { ced_usu, nom_usu, sta_usu };
}

const deleteUserModel = async ({ ced_usu }) => {
    const [result] = await db.query('DELETE FROM usu_ren WHERE ced_usu=?', [ced_usu]);
    return result.affectedRows > 0; // Devuelve true si eliminó algo
}

export const userModel = {
    createUserModel,
    updateUserModel,
    deleteUserModel,
    getUsersModel,
    getUserModel,
}