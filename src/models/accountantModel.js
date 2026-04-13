import { db } from '../database/connection.database.js'

const getAccountantsModel = async () => {
    const [rows] = await db.query('SELECT * FROM ctd_ren');
    return rows;
};

const getAccountantModel = async ({ ced_ctd }) => {
    const [rows] = await db.query('SELECT * FROM ctd_ren WHERE ced_ctd=?', [ced_ctd]);
    return rows;
}

const createAccountantModel = async ({ ced_ctd, ape_cdt, nom_cdt, dir_cdt, sta_cdt }) => {
    await db.query('INSERT INTO ctd_ren (ced_ctd, ape_ctd, nom_ctd, dir_cdt, sta_ctd) VALUES (?,?,?,?,?)', 
    [ced_ctd, ape_cdt, nom_cdt, dir_cdt, sta_cdt]);
    return { ced_ctd, ape_cdt, nom_cdt, dir_cdt, sta_cdt }
};

const updateAccountantModel = async (ced_ctd, {ape_cdt, nom_cdt, dir_cdt, sta_cdt}) => {
    await db.query(
        'UPDATE ctd_ren SET ape_cdt=?, nom_cdt=?, dir_cdt=?, sta_cdt=?',
        [ape_cdt, nom_cdt, dir_cdt, sta_cdt]
    );
    return { ape_cdt, nom_cdt, dir_cdt, sta_cdt };
};

const deleteAccountantModel = async ({ ced_ctd }) => {
    const [result] = await db.query('DELETE FROM ctd_ren WHERE ced_ctd=?', [ced_ctd]);
    return result.affectedRows > 0;
};

export const accountantModel = {
    getAccountantModel,
    getAccountantsModel,
    createAccountantModel,
    updateAccountantModel,
    deleteAccountantModel,
};