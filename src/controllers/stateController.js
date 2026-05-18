import { stateModel } from "../models/stateModel.js"; // FIXED: .js instead of .JS

const getStates = async (req, res) => {
    try {
        const states = await stateModel.getStatesModel();
        res.json(states);
    } catch (error) {
        console.error('Error al Recuperar los Estados', error);
        res.status(500).json({message: 'Error al Recuperar los Estados'});
    }
};

const getState = async (req, res) => {
    const { cod_sta } = req.params;
    try {
        const state = await stateModel.getStateModel({cod_sta});
        if(!state){
            return res.status(404).json({message: 'Estatus no Encontrado'});
        }
        res.json(state);
    } catch (error) {
        console.error('Error al Recuperar el Estado', error);
        res.status(500).json({message: 'Error al Recuperar el Estado'});
    }
};

export const StateController = {
    getStates,
    getState,
};
