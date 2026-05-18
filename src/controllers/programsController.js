import { programsModel } from "../models/programsModel.js";

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
        const program = await programsModel.getProgamModel({ cod_pro });
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
    const { nom_pro, sta_pro } = req.body;
    try {
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
        const updatedProgram = await programsModel.updateProgramModel(cod_pro, { nom_pro, sta_pro });
        if (!updatedProgram) {
            return res.status(404).json({ message: 'Programa no Encontrado o no se realizaron cambios' });
        }
        res.json({ message: 'Programa actualizado con éxito', data: updatedProgram });
    } catch (error) {
        console.error('Error al Editar el Programa:', error);
        res.status(500).json({ message: 'Error al Editar el Programa' });
    }
};

const deleteProgram = async (req, res) => {
    const { cod_pro } = req.params;
    try {
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