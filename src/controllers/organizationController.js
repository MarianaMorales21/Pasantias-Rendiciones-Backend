import { organizationModel } from "../models/organizationModel.js";

const getOrganizations = async (req, res) => {
    try {
        const organizations = await organizationModel.getOrganizationsModel();
        res.json(organizations);
    } catch (error) {
        console.error('Error al Recuperar las Organizaciones', error);
        res.status(500).json({message: 'Error al Recuperar las Organizaciones'});
    }
};

const getOrganization = async (req, res) => {
    const { rif_org } = req.params;
    try {
        const organization = await organizationModel.getOrganizationModel({rif_org});
        if(!organization){
            return res.status(404).json({message: 'Organización no Encontrada'});
        }
        res.json(organization);
    } catch (error) {
        console.error('Error al Recuperar la Organización', error);
        res.status(500).json({message: 'Error al Recuperar la Organización'})
    }
};

const createOrganization = async (req, res) => {
    const { rif_org, nom_org, dir_org, tel_org, ced_ctd, sta_org } = req.body;
    try {
        const newOrg = await organizationModel.createOrganizationModel({ rif_org, nom_org, dir_org, tel_org, ced_ctd, sta_org });
        res.status(201).json(newOrg);
    } catch (error) {
        console.error('Error al Crear la Organización', error);
        res.status(500).json({message: 'Error al Crear la Organización'});
    }
};

const updateOrganization = async (req, res) => {
    const { rif_org } = req.params;
    const { nom_org, dir_org, tel_org, ced_ctd, sta_org } = req.body;
    try {
        const updateOrg = await organizationModel.updateOrganizationModel(rif_org, { nom_org, dir_org, tel_org, ced_ctd, sta_org });
        if(!updateOrg){
            return res.status(404).json({message: 'Organización no Encontrada o sin cambios'});
        }
        res.json({message: 'Organización Actualizada con Exito', data: updateOrg});
    } catch (error) {
        console.error('Error al Editar la Organización', error);
        res.status(500).json({message: 'Error al Editar la Organización'});
    }
};

const deleteOrganization = async (req, res) => {
    const { rif_org } = req.params;
    try {
        const isDelete = await organizationModel.deleteOrganizationModel({ rif_org });
        if(!isDelete){
            return res.status(404).json({message: 'Organización no Encontrada'});
        }
        res.status(200).json({message: 'Organización Eliminada con Exito'});
    } catch (error) {
        console.error('Error al Eliminar la Organización', error);
        res.status(500).json({message: 'Error al Eliminar la Organización'});
    }
};

export const OrganizationControllers = {
    getOrganization,
    getOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization
};