import { organizationModel } from "../models/organizationModel.js";

const getOrganizations = async (req, res) => {
    try {
        const organizations = await organizationModel.getOrganizationsModel();
        res.json(organizations)
    } catch (error) {
        console.error('Error al Recuperar las Organizacion', error);
        res.status(500).json({message: 'Error al Recuperar las Organizacion'});
    }
};

const getOrganization = async (req, res) => {
    const { rif_org } = req.params;
    try {
        const organization = await organizationModel.getOganizationModel({rif_org});
        if(!organization){
            return res.status(404).json({message: 'Organizacion no Encontrada'});
        }
        res.json(organization);
    } catch (error) {
        console.error('Error al Recuperar la Organizacion', error);
        res.status(500).json({message: 'Error al Recuperar la Organizacion'})
    }
};

export const OrganizationControllers = {
    getOrganization,
    getOrganizations,
}