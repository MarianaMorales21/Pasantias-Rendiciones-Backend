import { accountantModel } from "../models/accountantModel.js";
import { db } from "../database/connection.database.js";

// Verificar si un cuentadante tiene órdenes de pago vinculadas (por cod_ctd)
const accountantIsInUse = async (cod_ctd) => {
    const [ordenes] = await db.query('SELECT COUNT(*) as count FROM opg_ren WHERE ctd_opg = ?', [cod_ctd]);
    return {
        inUse: ordenes[0].count > 0,
        ordenes: ordenes[0].count,
        organizaciones: 0
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
    const { cod_ctd } = req.params;
    try {
        const accountant = await accountantModel.getAccountantModel({ cod_ctd });
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
    let { ced_ctd, ape_ctd, nom_ctd, dir_ctd, sta_ctd } = req.body;
    try {
        // Duplicate cédula check
        const existing = await accountantModel.getAccountantModel({ ced_ctd });
        if (existing) {
            return res.status(409).json({ message: `Ya existe un cuentadante con la cédula "${ced_ctd}".` });
        }

        // Non-admin: force status to active
        if (req.user.rol !== 1) {
            sta_ctd = 1;
        }

        const newAccountant = await accountantModel.createAccountantModel({ ced_ctd, ape_ctd, nom_ctd, dir_ctd, sta_ctd });
        res.status(201).json(newAccountant);
    } catch (error) {
        console.error('Error al Crear Cuentadante', error);
        res.status(500).json({message: 'Error al Crear Cuentadante'});
    }
};

const updateAccountant = async (req, res) => {
    const { cod_ctd } = req.params;
    const { ced_ctd: newCedula, ape_ctd, nom_ctd, dir_ctd, sta_ctd } = req.body;
    try {
        const current = await accountantModel.getAccountantModel({ cod_ctd });
        if (!current) {
            return res.status(404).json({ message: 'Cuentadante no Encontrado' });
        }

        if (newCedula && newCedula !== current.ced_ctd) {
            const existing = await accountantModel.getAccountantModel({ ced_ctd: newCedula });
            if (existing) {
                return res.status(409).json({ message: `Ya existe un cuentadante con la cédula "${newCedula}".` });
            }
        }

        // Build update data
        const updateData = { ced_ctd: newCedula, ape_ctd, nom_ctd, dir_ctd, sta_ctd };

        // Non-admin restrictions: strip protected fields
        if (req.user.rol !== 1) {
            if (newCedula && newCedula !== current.ced_ctd) {
                updateData.ced_ctd = current.ced_ctd;
            }
            if (sta_ctd !== undefined && sta_ctd !== current.sta_ctd) {
                updateData.sta_ctd = current.sta_ctd;
            }
        }

        const updatedAccountant = await accountantModel.updateAccountantModel(cod_ctd, updateData);
        res.json({message: 'Cuentadante Actualizado con Exito', data: updatedAccountant});
    } catch (error) {
        console.error('Error al Editar Cuentadante', error);
        res.status(500).json({message: 'Error al Editar Cuentadante'});
    }
};

const deleteAccountant = async (req, res) => {
    const { cod_ctd } = req.params;
    try {
        const current = await accountantModel.getAccountantModel({ cod_ctd });
        if (!current) {
            return res.status(404).json({ message: 'No se encontro el Cuentadante' });
        }

        // Verificar uso por cod_ctd (no por ced_ctd)
        const uso = await accountantIsInUse(cod_ctd);
        if (uso.inUse) {
            const partes = [];
            if (uso.ordenes > 0) partes.push(`${uso.ordenes} Órdenes de Pago`);
            return res.status(409).json({
                message: `No se puede eliminar el Cuentadante porque está vinculado a ${partes.join(' y ')}. Cambie su estado a Inactivo en su lugar.`
            });
        }

        const isDelete = await accountantModel.deleteAccountantModel({ cod_ctd });
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
