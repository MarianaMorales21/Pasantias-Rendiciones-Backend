import { departureModel } from "../models/departureModels.js";
import { db } from "../database/connection.database.js";

// Verificar si la partida está en uso en detalles de gasto
const partidaIsInUse = async (cod_par) => {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM drn_ren WHERE par_drn = ?', [cod_par]);
    return rows[0].count > 0;
};

const getDepartures = async (req, res) => {
    try {
        const departure = await departureModel.getDeparturesModel();
        res.json(departure);
    } catch (error) {
        console.error('Error al Recuperar las partidas', error);
        res.status(500).json({ message: 'Error al Recuperar las Partidas' });
    }
};

const getDeparture = async (req, res) => {
    const { cod_par } = req.params;
    try {
        const departure = await departureModel.getDepartureModel({ cod_par });
        if (!departure) {
            return res.status(404).json({ message: 'Partida no Encontrada' });
        }
        res.json(departure);
    } catch (error) {
        console.error('Error al Recuperar Partida', error);
        res.status(500).json({ message: 'Error al Recuperar Partida' });
    }
};

const createDeparture = async (req, res) => {
    const { num_par, nom_par } = req.body;
    try {
        const newDeparture = await departureModel.createDepartureModel({ num_par, nom_par });
        res.status(201).json(newDeparture);
    } catch (error) {
        console.error('Error al Crear Partida', error);
        res.status(500).json({ message: 'Error al Crear Partida' });
    }
};

const updateDeparture = async (req, res) => {
    const { cod_par } = req.params;
    const { num_par, nom_par } = req.body;
    try {
        const updatedDeparture = await departureModel.updateDepartureModel(cod_par, { num_par, nom_par });
        if (!updatedDeparture) {
            return res.status(404).json({ message: 'Partida no Encontrada' });
        }
        res.status(200).json({ message: 'Partida actualizada con exito', data: updatedDeparture });
    } catch (error) {
        console.error('Error al Editar Partida', error);
        res.status(500).json({ message: 'Error al Editar Partida' });
    }
};

const deleteDeparture = async (req, res) => {
    const { cod_par } = req.params;
    try {
        // No eliminar si está en uso en detalles de gasto
        const inUse = await partidaIsInUse(cod_par);
        if (inUse) {
            return res.status(409).json({ message: 'No se puede eliminar esta Partida Presupuestaria porque está siendo utilizada en Detalles de Gasto existentes.' });
        }

        const isDelete = await departureModel.deleteDepartureModel({ cod_par });
        if (!isDelete) {
            return res.status(404).json({ message: 'Partida no Encontrada' });
        }
        res.status(200).json({ message: 'Partida Eliminada con Exito' });
    } catch (error) {
        console.error('Error al Eliminar Partida', error);
        res.status(500).json({ message: 'Error al Eliminar Partida' });
    }
};

export const DepartureControllers = {
    getDeparture,
    getDepartures,
    createDeparture,
    updateDeparture,
    deleteDeparture,
};