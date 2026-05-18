import { departureModel } from "../models/departureModels.js";

const getDepartures = async (req, res) => {
    try {
        const departure = await departureModel.getDeparturesModel();
        res.json(departure);
    } catch (error) {
        console.error('Error al Recuperar las partidas', error);
        res.status(500).json({message: 'Error al Recuperar las Partidas'});
    };
};

const getDeparture = async (req, res) => {
    const { cod_par } = req.params;
    try {
        const departure = await departureModel.getDepartureModel({cod_par});
        if(!departure){
            return res.status(404).json({massage:'Partida no Encontrada'});
        }
        res.json(departure);
    } catch (error) {
        console.error('Error al Recuperar Partida', error);
        res.status(500).json({message: 'Error al Recuperar Partida'})
    };
};

const createDeparture = async (req, res) => {
    const { num_par, nom_par } = req.body;
    try {
        const newDeparture = await departureModel.createDepartureModel({num_par, nom_par});
        res.status(201).json(newDeparture);
    } catch (error) {
        console.error('Error al Crear Partida', error);
        res.status(500).json({message: 'Error al Crear Partida'});
    };
};

const updateDeparture = async (req, res) => {
    const { cod_par } = req.params;
    const { num_par, nom_par } = req.body;
    try {
        const updateDeparture = await departureModel.updateDepartureModel(cod_par, { num_par, nom_par });
        if(!updateDeparture){
            return res.status(404).json({message: 'Partida no Encontrada'});
        }
        res.status(200).json({message: 'Partida actualizada con exito', data: updateDeparture});
    } catch (error) {
        console.error('Error al Editar Partida', error);
        res.status(500).json({message: 'Error al Editar Partida'});
    };
};

const deleteDeparture = async (req, res) => {
    const { cod_par } = req.params;
    try {
        const isDelete = await departureModel.deleteDepartureModel({cod_par});
        if (!isDelete){
            return res.status(404).json({massage: 'Partida no Encontrada'});
        };
        res.status(200).json({message: 'Partida Eliminada con Exito'});
    } catch (error) {
        console.error('Error al Eliminar Partida', error);
        res.status(500).json({message: 'Error all Eliminar Partida'});
    };
};

export const DepartureControllers = {
    getDeparture,
    getDepartures,
    createDeparture,
    updateDeparture,
    deleteDeparture,
};