import { accountantModel } from "../models/accountantModel.js";

const getAccountants = async (req, res) => {
    try {
        const accountant = await accountantModel.getAccountantsModel();
        res.json(accountant)
    } catch (error) {
        console.error('Error al Recuperar los Cuentadantes', error);
        res.status(500).json({ message: 'Error al Recuperar los Cuentadantes'})
    }
};

const getAccountant = async (req, res) => {
    const { ced_ctd} = req.params;
    try {
        const accountant = await accountantModel.getAccountantModel({ ced_ctd });
        if (!accountant) {
            return res.status(404).json({message: 'Cuentadante no Encontrado'}); 
        };
        res.json(accountant);
    } catch (error) {
        console.error('Error al Recuperar Cuentadante', error);
        res.status(500).json({ message: 'Error al Recuperar Cuentadante' });
    };
};

const createAccountant = async (req, res) => {
    const { ced_ctd, ape_cdt, nom_cdt, dir_cdt, sta_cdt } = req.body;
    try {
        const newAccountant = await accountantModel.createAccountantModel({ced_ctd, ape_cdt, nom_cdt, dir_cdt, sta_cdt});
        res.status(201).json(newAccountant);
    } catch (error) {
        console.error('Error al Crear Cuentadante', error);
        res.status(500).json({message: 'Error al Crear Cuentadante'});
    }
};

const updateAccountant = async (req, res) => {
    const { ced_ctd } = req.params;
    const { ape_cdt, nom_cdt, dir_cdt, sta_cdt } = req.body;
    try {
        const updateAccountant = await accountantModel.updateAccountantModel(ced_ctd, {ape_cdt, nom_cdt, dir_cdt, sta_cdt});
        if(!updateAccountant){
            return res.status(404).json({message: 'Cuentadante no Encontrado'});
        }
        res.json({message: 'Cuentadante Actualizado con Exito'});
    } catch (error) {
        console.error('Error al Editar Cuentadante', error);
        res.status(500).json({message: 'Error al Editar Cuentadante'});
    };
};

const deleteAccountant = async (req, res) => {
    const { ced_ctd } = req.params;
    try {
        const isDelete = await accountantModel.deleteAccountantModel({ ced_ctd });
        if(!isDelete) {
            res.status(404).json({message: 'No se encontro el Cuentadante'});
        }
        res.status(200).json({message: 'Cuentante Eliminado con Exito'});
    } catch (error) {
        console.error('Error al Eliminar Cuentadante', error);
        res.status(500).json({message: 'Error al Eliminar Cuentadante'})
    };
};

export const AccountantController = {
    getAccountant,
    getAccountants,
    createAccountant,
    updateAccountant,
    deleteAccountant,
}