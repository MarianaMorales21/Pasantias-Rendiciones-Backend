import { beneficiaryModel } from "../models/beneficiaryModel.js";
import { db } from "../database/connection.database.js";

// Verificar si un RIF está en uso en notas de débito
const rifIsInUse = async (rif_ben) => {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM ndb_ren WHERE rif_ndb = ?', [rif_ben]);
    return rows[0].count > 0;
};

// Validar formato RIF venezolano (J-12345678-9)
const isValidRif = (rif) => {
    return /^[VJEGP]-?\d{8}-?\d$/.test(rif.trim().toUpperCase());
};

const getBeneficiarys = async (req, res) => {
    try {
        const beneficiary = await beneficiaryModel.getBeneficiarysModel();
        res.json(beneficiary);
    } catch (error) {
        console.error('Error al Recuperar los Beneficiarios', error);
        res.status(500).json({ message: 'Error al Recuperar los Beneficiarios' });
    }
};

const getBeneficiary = async (req, res) => {
    const { rif_ben } = req.params;
    try {
        const beneficiary = await beneficiaryModel.getBeneficiaryModel({ rif_ben });
        if (!beneficiary) {
            return res.status(404).json({ message: 'Beneficiario no Encontrado' });
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
        // Validar formato RIF
        if (!isValidRif(rif_ben)) {
            return res.status(400).json({ message: 'El formato del RIF no es válido. Debe ser: J-12345678-9 (V, J, E, G o P seguido de 8 dígitos y un dígito verificador).' });
        }

        // Verificar duplicado de RIF
        const existing = await beneficiaryModel.getBeneficiaryModel({ rif_ben });
        if (existing) {
            return res.status(409).json({ message: `Ya existe un Beneficiario con el RIF "${rif_ben}".` });
        }

        const newBeneficiary = await beneficiaryModel.createBeneficiaryModel({ rif_ben, nom_ben, dir_ben, sta_ben });
        res.status(201).json(newBeneficiary);
    } catch (error) {
        console.error('Error al Crear el Beneficiario', error);
        res.status(500).json({ message: 'Error al Crear el Beneficiario' });
    }
};

const updateBeneficiary = async (req, res) => {
    const { rif_ben } = req.params;
    const { nom_ben, dir_ben, sta_ben } = req.body;
    try {
        const updatedBeneficiary = await beneficiaryModel.updateBeneficiaryModel(rif_ben, { nom_ben, dir_ben, sta_ben });
        if (!updatedBeneficiary) {
            return res.status(404).json({ message: 'Beneficiario no Encontrado o no se realizaron cambios' });
        }
        res.json({ message: 'Beneficiario actualizado con exito', data: updatedBeneficiary });
    } catch (error) {
        console.error('Error al Editar el Beneficiario', error);
        res.status(500).json({ message: 'Error al Editar el Beneficiario' });
    }
};

const deleteBeneficiary = async (req, res) => {
    const { rif_ben } = req.params;
    try {
        // No eliminar si está en uso en notas de débito
        const inUse = await rifIsInUse(rif_ben);
        if (inUse) {
            return res.status(409).json({ message: 'No se puede eliminar este Beneficiario porque está asociado a Notas de Débito existentes.' });
        }

        const isDelete = await beneficiaryModel.deleteBeneficiaryModel({ rif_ben });
        if (!isDelete) {
            return res.status(404).json({ message: 'Beneficiario no Encontrado' });
        }
        res.status(200).json({ message: 'Beneficiario Eliminado con Exito' });
    } catch (error) {
        console.error('Error al Eliminar el Beneficiario', error);
        res.status(500).json({ message: 'Error al Eliminar el Beneficiario' });
    }
};

export const BeneficiaryControllers = {
    getBeneficiary,
    getBeneficiarys,
    createBeneficiary,
    deleteBeneficiary,
    updateBeneficiary,
};