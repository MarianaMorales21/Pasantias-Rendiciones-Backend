import { beneficiaryModel } from "../models/beneficiaryModel.js";

const getBeneficiarys = async (req, res) => {
    try {
        const beneficiary = await beneficiaryModel.getBeneficiarysModel();
        res.json(beneficiary)
    } catch (error) {
        console.error('Error al Recuperar los Beneficiarios', error);
        res.status(500).json({ message:'Error al Recuperar los Beneficiarios'});
    }
};

const getBeneficiary = async (req, res) => {
    const { rif_ben } = req.params;
    try {
        const beneficiary = await beneficiaryModel.getBeneficiaryModel({ rif_ben });
        if (!beneficiary) {
            return res.status(404).json({ message: 'Beneficiario no Encontrado'});
        }
        res.json(beneficiary);
    } catch (error) {
        console.error('Error al Recuperar los Beneficiarios', error);
        res.status(500).json({ message: "Error al Recuperar los Beneficiarios" });
    }
};

const createBeneficiary = async (req, res) => {
    const { rif_ben, nom_ben, dir_ben, sta_ben } = req.body;
    try {
        const newBeneficiary = await beneficiaryModel.createBeneficiaryModel({ rif_ben, nom_ben, dir_ben, sta_ben });
        res.status(201).json(newBeneficiary);
    } catch (error) {
        console.error('Error al Crear el Beneficiario', error);
        res.status(500).json({ message: 'Error al Crear el Beneficiario'})
    }
}

const updateBeneficiary = async (req, res) => {
    const { rif_ben } = req.params;
    const { nom_ben, dir_ben, sta_ben } = req.body;
    try {
        const updateBeneficiary = await beneficiaryModel.updateBeneficiaryModel(rif_ben, {nom_ben, dir_ben, sta_ben});
        if(!updateBeneficiary) {
            return res.status(404).json({ message: 'Beneficiario no Encontrado o no se realizaron cambios'});
        }
        res.json({ message:'Beneficiario actualizado con exito', data: updateBeneficiary});
    } catch (error) {
        console.error('Error al Editar el Beneficiario', error);
        res.status(500).json({ message: 'Error al Editar el Beneficiario'});
    }
};

const deleteBeneficiary = async (req, res) => {
    const { rif_ben } = req.params;
    try {
        const isDelete = await beneficiaryModel.deleteBeneficiaryModel({ rif_ben });
        if (!isDelete) {
            return res.status(404).json({ message: 'Beneficiario no Encontrado'});
        }
        res.status(200).json({ message: 'Beneficiario Eliminado con Exito'});
    } catch (error) {
        console.error('Error al Eliminar el Beneficiario', error);
        res.status(500).json({ message: 'Error al Eliminar el Beneficiario'});
    }
};

export const BeneficiaryControllers = {
    getBeneficiary,
    getBeneficiarys,
    createBeneficiary,
    deleteBeneficiary,
    updateBeneficiary,
}