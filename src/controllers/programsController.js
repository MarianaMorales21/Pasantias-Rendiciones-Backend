import { programsModel } from "../models/programsModel.js";
import { db } from "../database/connection.database.js";

// Verificar si el programa está en uso en notas de débito
const programIsInUse = async (cod_pro) => {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM ndb_ren WHERE pro_ndb = ?', [cod_pro]);
    return rows[0].count > 0;
};

const getPrograms = async (req, res) => {
    try {
        const programs = await programsModel.getProgramsModel();
        res.json(programs);
    } catch (error) {
        console.error('Error al Recuperar los Programas:', error);
        res.status(500).json({ message: 'Error al Recuperar los Programas' });
    }
};

const getProgram = async (req, res) => {
    const { cod_pro } = req.params;
    try {
        const program = await programsModel.getProgramModel({ cod_pro });
        if (!program) {
            return res.status(404).json({ message: 'Programa no Encontrado' });
        }
        res.json(program);
    } catch (error) {
        console.error('Error al Recuperar el Programa:', error);
        res.status(500).json({ message: 'Error al Recuperar el Programa' });
    }
};

const createProgram = async (req, res) => {
    let { nom_pro, sta_pro } = req.body;
    try {
        // Non-admin: force status to active
        if (req.user.rol !== 1) {
            sta_pro = 1;
        }

        const newProgram = await programsModel.createProgramModel({ nom_pro, sta_pro });
        res.status(201).json(newProgram);
    } catch (error) {
        console.error('Error al Crear el Programa:', error);
        res.status(500).json({ message: 'Error al Crear el Programa' });
    }
};

const updateProgram = async (req, res) => {
    const { cod_pro } = req.params;
    const { nom_pro, sta_pro } = req.body;
    try {
        // Read current program for comparison
        const current = await programsModel.getProgamModel({ cod_pro });
        if (!current) {
            return res.status(404).json({ message: 'Programa no Encontrado' });
        }

        // Build update data
        const updateData = { nom_pro, sta_pro };

        // Non-admin: strip protected fields
        if (req.user.rol !== 1) {
            if (sta_pro !== undefined && sta_pro !== current.sta_pro) {
                updateData.sta_pro = current.sta_pro;
            }
        }

        const updatedProgram = await programsModel.updateProgramModel(cod_pro, updateData);
        res.json({ message: 'Programa actualizado con éxito', data: updatedProgram });
    } catch (error) {
        console.error('Error al Editar el Programa:', error);
        res.status(500).json({ message: 'Error al Editar el Programa' });
    }
};

const deleteProgram = async (req, res) => {
    const { cod_pro } = req.params;
    try {
        // No eliminar si está en uso en notas de débito
        const inUse = await programIsInUse(cod_pro);
        if (inUse) {
            return res.status(409).json({ message: 'No se puede eliminar este Programa porque tiene Notas de Débito asociadas.' });
        }

        const isDeleted = await programsModel.deleteProgramModel({ cod_pro });
        if (!isDeleted) {
            return res.status(404).json({ message: 'Programa no Encontrado' });
        }
        res.status(200).json({ message: 'Programa eliminado correctamente' });
    } catch (error) {
        console.error('Error al Eliminar el Programa:', error);
        res.status(500).json({ message: 'Error al Eliminar el Programa' });
    }
};

export const ProgramsControllers = {
    getProgram,
    getPrograms,
    createProgram,
    deleteProgram,
    updateProgram,
};