import { renditionModel } from "../models/renditionModel.js";

const getRenditions = async (req, res) => {
    try {
        const renditions = await renditionModel.getRenditionsModel();
        res.json(renditions);
    } catch (error) {
        console.error('Error al Recuperar las Rendiciones', error);
        res.status(500).json({ message: 'Error al Recuperar las Rendiciones' });
    }
};

const getRenditionsByOpg = async (req, res) => {
    const { opg_rnd } = req.params;
    try {
        const renditions = await renditionModel.getRenditionsByOpgModel(opg_rnd);
        res.json(renditions);
    } catch (error) {
        console.error('Error al Recuperar las Rendiciones por OPG', error);
        res.status(500).json({ message: 'Error al Recuperar las Rendiciones por OPG' });
    }
};

const getRendition = async (req, res) => {
    const { cod_rnd } = req.params;
    try {
        const rendition = await renditionModel.getRenditionModel({ cod_rnd });
        if (!rendition) return res.status(404).json({ message: 'Rendición no Encontrada' });
        res.json(rendition);
    } catch (error) {
        console.error('Error al Recuperar la Rendición', error);
        res.status(500).json({ message: 'Error al Recuperar la Rendición' });
    }
};

const createRendition = async (req, res) => {
    // Desestructuramos para asegurar que opg_rnd esté presente según el nuevo modelo
    const { num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, sta_rnd } = req.body;
    try {
        const newRnd = await renditionModel.createRenditionModel({ 
            num_rnd, 
            opg_rnd, 
            fec_rnd, 
            prd_rnd, 
            avs_rnd, 
            sta_rnd 
        });
        res.status(201).json(newRnd);
    } catch (error) {
        console.error('Error al Crear la Rendición', error);
        res.status(500).json({ message: 'Error al Crear la Rendición' });
    }
};

const updateRendition = async (req, res) => {
    const { cod_rnd } = req.params;
    const { num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, sta_rnd } = req.body;
    try {
        const updated = await renditionModel.updateRenditionModel(cod_rnd, { 
            num_rnd, 
            opg_rnd, 
            fec_rnd, 
            prd_rnd, 
            avs_rnd, 
            sta_rnd 
        });
        if (!updated) return res.status(404).json({ message: 'Rendición no encontrada o sin cambios' });
        res.json({ message: 'Rendición actualizada con éxito', data: updated });
    } catch (error) {
        console.error('Error al Editar la Rendición', error);
        res.status(500).json({ message: 'Error al Editar la Rendición' });
    }
};

const deleteRendition = async (req, res) => {
    const { cod_rnd } = req.params;
    try {
        const result = await renditionModel.deleteRenditionModel({ cod_rnd });
        if (!result) return res.status(404).json({ message: 'Rendición no encontrada' });
        res.json({ message: 'Rendición eliminada con éxito' });
    } catch (error) {
        console.error('Error al Eliminar la Rendición', error);
        res.status(500).json({ message: 'Error al Eliminar la Rendición' });
    }
};

export const renditionController = {
    getRenditions,
    getRenditionsByOpg,
    getRendition,
    createRendition,
    updateRendition,
    deleteRendition,
};