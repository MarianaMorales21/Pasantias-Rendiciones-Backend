import { accountantModel } from "../models/accountantModel.js";
import { db } from "../database/connection.database.js";

const accountantIsInUse = async (ced_ctd) => {
    const [ordenes] = await db.query('SELECT COUNT(*) as count FROM opg_ren WHERE ced_opg = ?', [ced_ctd]);
    const [organizaciones] = await db.query('SELECT COUNT(*) as count FROM org_ren WHERE ced_ctd = ?', [ced_ctd]);
    return {
        inUse: ordenes[0].count > 0 || organizaciones[0].count > 0,
        ordenes: ordenes[0].count,
        organizaciones: organizaciones[0].count
    };
};

const getAccountants = async (req, res) => {
    try {
        const accountants = await accountantModel.getAccountantsModel();
        res.json(accountants);
    } catch (error) {
        console.error('Error al Recuperar los Cuentadantes', error);
        res.status(500).json({ message: 'Error al Recuperar los Cuentadantes'});
    }
};

const getAccountant = async (req, res) => {
    const { ced_ctd } = req.params;
    try {
        const accountant = await accountantModel.getAccountantModel({ ced_ctd });
        if (!accountant) {
            return res.status(404).json({message: 'Cuentadante no Encontrado'}); 
        }
        res.json(accountant);
    } catch (error) {
        console.error('Error al Recuperar Cuentadante', error);
        res.status(500).json({ message: 'Error al Recuperar Cuentadante' });
    }
};

const createAccountant = async (req, res) => {
    const { ced_ctd, ape_ctd, nom_ctd, dir_ctd, sta_ctd } = req.body;
    try {
        const newAccountant = await accountantModel.createAccountantModel({ ced_ctd, ape_ctd, nom_ctd, dir_ctd, sta_ctd });
        res.status(201).json(newAccountant);
    } catch (error) {
        console.error('Error al Crear Cuentadante', error);
        res.status(500).json({message: 'Error al Crear Cuentadante'});
    }
};

const updateAccountant = async (req, res) => {
    const { ced_ctd } = req.params;
    const { ape_ctd, nom_ctd, dir_ctd, sta_ctd } = req.body;
    try {
        const updatedAccountant = await accountantModel.updateAccountantModel(ced_ctd, { ape_ctd, nom_ctd, dir_ctd, sta_ctd });
        if(!updatedAccountant){
            return res.status(404).json({message: 'Cuentadante no Encontrado o sin cambios'});
        }
        res.json({message: 'Cuentadante Actualizado con Exito', data: updatedAccountant});
    } catch (error) {
        console.error('Error al Editar Cuentadante', error);
        res.status(500).json({message: 'Error al Editar Cuentadante'});
    }
};

const deleteAccountant = async (req, res) => {
    const { ced_ctd } = req.params;
    try {
        const uso = await accountantIsInUse(ced_ctd);
        if (uso.inUse) {
            const partes = [];
            if (uso.ordenes > 0) partes.push(`${uso.ordenes} Órdenes de Pago`);
            if (uso.organizaciones > 0) partes.push(`${uso.organizaciones} Organizaciones`);
            return res.status(409).json({
                message: `No se puede eliminar el Cuentadante porque está vinculado a ${partes.join(' y ')}. Cambie su estado a Inactivo en su lugar.`
            });
        }

        const isDelete = await accountantModel.deleteAccountantModel({ ced_ctd });
        if(!isDelete) {
            return res.status(404).json({message: 'No se encontro el Cuentadante'});
        }
        res.status(200).json({message: 'Cuentadante Eliminado con Exito'});
    } catch (error) {
        console.error('Error al Eliminar Cuentadante', error);
        res.status(500).json({message: 'Error al Eliminar Cuentadante'});
    }
};

export const AccountantController = {
    getAccountant,
    getAccountants,
    createAccountant,
    updateAccountant,
    deleteAccountant,
};