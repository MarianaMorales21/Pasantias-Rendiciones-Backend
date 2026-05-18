import { db } from "../database/connection.database.js";

const getUsersModel = async () => {
    const [rows] = await db.query(`
        SELECT TRIM(u.ced_usu) as ced_usu, u.nom_usu, u.ema_usu, u.sta_usu, u.rol_usu, s.nom_sta, r.nom_rol as rol_nom
        FROM usu_ren u
        LEFT JOIN sta_ren s ON u.sta_usu = s.cod_sta
        LEFT JOIN rol_ren r ON u.rol_usu = r.cod_rol
    `);
    return rows;
}

const getUserModel = async ({ ced_usu }) => {
    const [rows] = await db.query(`
        SELECT TRIM(u.ced_usu) as ced_usu, u.nom_usu, u.ema_usu, u.sta_usu, u.cla_usu, u.rol_usu, s.nom_sta, r.nom_rol as rol_nom
        FROM usu_ren u
        LEFT JOIN sta_ren s ON u.sta_usu = s.cod_sta
        LEFT JOIN rol_ren r ON u.rol_usu = r.cod_rol
        WHERE TRIM(u.ced_usu) = ?
    `, [ced_usu]);
    return rows[0];
}

// Buscar por email para recuperación
const getUserByEmailModel = async (ema_usu) => {
    const [rows] = await db.query(`
        SELECT u.ced_usu, u.nom_usu, u.ema_usu
        FROM usu_ren u
        WHERE u.ema_usu = ?
    `, [ema_usu]);
    return rows[0];
}

const createUserModel = async ({ ced_usu, nom_usu, ema_usu, cla_usu, sta_usu, rol_usu }) => {
    await db.query(
        'INSERT INTO usu_ren (ced_usu, nom_usu, cla_usu, ema_usu, rol_usu, sta_usu) VALUES (?, ?, ?, ?, ?, ?)',
        [ced_usu, nom_usu, cla_usu, ema_usu, parseInt(rol_usu), parseInt(sta_usu)]
    );
    return { ced_usu, nom_usu, ema_usu, sta_usu, rol_usu }; 
}

const updateUserModel = async (ced_usu, { nom_usu, ema_usu, cla_usu, sta_usu, rol_usu }) => {
    if (cla_usu) {
        await db.query(
            'UPDATE usu_ren SET nom_usu=?, cla_usu=?, ema_usu=?, sta_usu=?, rol_usu=? WHERE TRIM(ced_usu)=?',
            [nom_usu, cla_usu, ema_usu, parseInt(sta_usu), parseInt(rol_usu), ced_usu]
        );
    } else {
        await db.query(
            'UPDATE usu_ren SET nom_usu=?, ema_usu=?, sta_usu=?, rol_usu=? WHERE TRIM(ced_usu)=?',
            [nom_usu, ema_usu, parseInt(sta_usu), parseInt(rol_usu), ced_usu]
        );
    }
    return { ced_usu, nom_usu, ema_usu, sta_usu, rol_usu };
}

// Nueva función para actualizar solo la contraseña (reset)
const updatePasswordModel = async (ced_usu, hashedPassword) => {
    await db.query('UPDATE usu_ren SET cla_usu = ? WHERE ced_usu = ?', [hashedPassword, ced_usu]);
    return true;
}

const deleteUserModel = async ({ ced_usu }) => {
    const [result] = await db.query('DELETE FROM usu_ren WHERE ced_usu=?', [ced_usu]);
    return result.affectedRows > 0;
}

export const userModel = {
    createUserModel,
    updateUserModel,
    deleteUserModel,
    getUsersModel,
    getUserModel,
    getUserByEmailModel,
    updatePasswordModel
}