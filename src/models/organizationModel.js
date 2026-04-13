import { db } from "../database/connection.database.js";

const getOrganizationsModel = async () => {
    const [rows] = await db.query('SELECT * FROM org_ren');
    return rows;
};

const getOganizationModel = async ({ rif_org }) => {
    const [rows] = await db.query('SELECT * FROM org_ren WHERE rif_org=?', [rif_org]);
    return rows;
};

export const organizationModel = {
    getOganizationModel,
    getOrganizationsModel,
}