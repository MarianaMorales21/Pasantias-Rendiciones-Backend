import { beneficiaryModel } from "../models/beneficiaryModel.js";
import { db } from "../database/connection.database.js";

// Verificar si un beneficiario tiene notas de débito vinculadas (por cod_ben)
const beneficiaryIsInUse = async (cod_ben) => {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM ndb_ren WHERE ben_ndb = ?', [cod_ben]);
    return rows[0].count > 0;
};

const isValidRif = (rif) => {
    const trimmed = rif.trim().toUpperCase();
    if (/^V-?\d{7,8}$/.test(trimmed)) return true;
    if (/^[GJ]-?\d+-\d$/.test(trimmed)) return true;
    return false;
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
    const { cod_ben } = req.params;
    try {
        const beneficiary = await beneficiaryModel.getBeneficiaryModel({ cod_ben });
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
    let { rif_ben, nom_ben, dir_ben, sta_ben } = req.body;
    try {
        rif_ben = (rif_ben || '').toUpperCase();
        dir_ben = (dir_ben || '').toUpperCase();

        if (!isValidRif(rif_ben)) {
            return res.status(400).json({ message: 'El formato del RIF no es válido. Para tipo V use 7-8 dígitos (V-12345678). Para tipo G o J use el formato con guion antes del último dígito (G-12345678-1 o J-12345678-1).' });
        }

        const existing = await beneficiaryModel.getBeneficiaryModel({ rif_ben });
        if (existing) {
            return res.status(409).json({ message: `Ya existe un Beneficiario con el RIF "${rif_ben}".` });
        }

        // Non-admin: force status to active
        if (req.user.rol !== 1) {
            sta_ben = 1;
        }

        const newBeneficiary = await beneficiaryModel.createBeneficiaryModel({ rif_ben, nom_ben, dir_ben, sta_ben });
        res.status(201).json(newBeneficiary);
    } catch (error) {
        console.error('Error al Crear el Beneficiario', error);
        res.status(500).json({ message: 'Error al Crear el Beneficiario' });
    }
};

const updateBeneficiary = async (req, res) => {
    const { cod_ben } = req.params;
    let { rif_ben: newRif, nom_ben, dir_ben, sta_ben } = req.body;
    try {
        newRif = (newRif || '').toUpperCase();
        dir_ben = (dir_ben || '').toUpperCase();

        const current = await beneficiaryModel.getBeneficiaryModel({ cod_ben });
        if (!current) {
            return res.status(404).json({ message: 'Beneficiario no Encontrado' });
        }

        if (newRif !== current.rif_ben && !isValidRif(newRif)) {
            return res.status(400).json({ message: 'El formato del RIF no es válido.' });
        }

        if (newRif !== current.rif_ben) {
            const existing = await beneficiaryModel.getBeneficiaryModel({ rif_ben: newRif });
            if (existing) {
                return res.status(409).json({ message: `Ya existe un beneficiario con el RIF "${newRif}".` });
            }
        }

        // Build update data
        const updateData = { rif_ben: newRif, nom_ben, dir_ben, sta_ben };

        // Non-admin restrictions: strip protected fields
        if (req.user.rol !== 1) {
            if (newRif && newRif !== current.rif_ben) {
                updateData.rif_ben = current.rif_ben;
            }
            if (sta_ben !== undefined && sta_ben !== current.sta_ben) {
                updateData.sta_ben = current.sta_ben;
            }
        }

        const updatedBeneficiary = await beneficiaryModel.updateBeneficiaryModel(cod_ben, updateData);
        res.json({ message: 'Beneficiario actualizado con exito', data: updatedBeneficiary });
    } catch (error) {
        console.error('Error al Editar el Beneficiario', error);
        res.status(500).json({ message: 'Error al Editar el Beneficiario' });
    }
};

const deleteBeneficiary = async (req, res) => {
    const { cod_ben } = req.params;
    try {
        const current = await beneficiaryModel.getBeneficiaryModel({ cod_ben });
        if (!current) {
            return res.status(404).json({ message: 'Beneficiario no Encontrado' });
        }

        // Verificar uso por cod_ben
        const inUse = await beneficiaryIsInUse(cod_ben);
        if (inUse) {
            return res.status(409).json({ message: 'No se puede eliminar este Beneficiario porque está asociado a Notas de Débito existentes.' });
        }

        const isDelete = await beneficiaryModel.deleteBeneficiaryModel({ cod_ben });
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
