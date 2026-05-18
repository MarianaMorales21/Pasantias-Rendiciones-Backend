import { db } from "../database/connection.database.js";

const getOrganizationsModel = async () => {
    const [rows] = await db.query(`
        SELECT o.*, c.nom_ctd, c.ape_ctd, s.nom_sta 
        FROM org_ren o
        JOIN ctd_ren c ON o.ced_ctd = c.ced_ctd
        JOIN sta_ren s ON o.sta_org = s.cod_sta
    `);
    return rows;
};

const getOrganizationModel = async ({ rif_org }) => {
    const [rows] = await db.query(`
        SELECT o.*, c.nom_ctd, c.ape_ctd, s.nom_sta 
        FROM org_ren o
        JOIN ctd_ren c ON o.ced_ctd = c.ced_ctd
        JOIN sta_ren s ON o.sta_org = s.cod_sta
        WHERE o.rif_org=?
    `, [rif_org]);
    return rows[0];
};

const createOrganizationModel = async ({ rif_org, nom_org, dir_org, tel_org, ced_ctd, sta_org }) => {
    await db.query(
        'INSERT INTO org_ren (rif_org, nom_org, dir_org, tel_org, ced_ctd, sta_org) VALUES (?,?,?,?,?,?)',
        [rif_org, nom_org, dir_org, tel_org, ced_ctd, parseInt(sta_org)]
    );
    return { rif_org, nom_org, dir_org, tel_org, ced_ctd, sta_org };
};

const updateOrganizationModel = async (rif_org, { nom_org, dir_org, tel_org, ced_ctd, sta_org }) => {
    await db.query(
        'UPDATE org_ren SET nom_org=?, dir_org=?, tel_org=?, ced_ctd=?, sta_org=? WHERE rif_org=?',
        [nom_org, dir_org, tel_org, ced_ctd, parseInt(sta_org), rif_org]
    );
    return { rif_org, nom_org, dir_org, tel_org, ced_ctd, sta_org };
};

const deleteOrganizationModel = async ({ rif_org }) => {
    const [result] = await db.query('DELETE FROM org_ren WHERE rif_org=?', [rif_org]);
    return result.affectedRows > 0;
};

export const organizationModel = {
    getOrganizationModel,
    getOrganizationsModel,
    createOrganizationModel,
    updateOrganizationModel,
    deleteOrganizationModel,
};