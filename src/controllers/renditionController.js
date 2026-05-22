import { renditionModel } from "../models/renditionModel.js";
import { orderModel } from "../models/orderModel.js";

// Estado ID que representa "Cerrado" — ajustar según la BD
const CLOSED_STATE_ID = 3;

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
    let { num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, sta_rnd, rnt_rnd } = req.body;
    try {
        // Normalizar mayúsculas
        prd_rnd = (prd_rnd || '').toUpperCase();

        // Verificar que la fecha no sea futura
        if (fec_rnd && new Date(fec_rnd) > new Date()) {
            return res.status(400).json({ message: 'La fecha de la Rendición no puede ser una fecha futura.' });
        }

        const newRnd = await renditionModel.createRenditionModel({ 
            num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, sta_rnd , rnt_rnd
        });

        if (opg_rnd) await orderModel.autoUpdateOpgStatus(opg_rnd);

        res.status(201).json(newRnd);
    } catch (error) {
        console.error('Error al Crear la Rendición', error);
        res.status(500).json({ message: 'Error al Crear la Rendición' });
    }
};

const updateRendition = async (req, res) => {
    const { cod_rnd } = req.params;
    let { num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, sta_rnd, rnt_rnd } = req.body;
    try {
        // Normalizar mayúsculas
        prd_rnd = (prd_rnd || '').toUpperCase();

        // Verificar si la rendición está cerrada
        const existing = await renditionModel.getRenditionModel({ cod_rnd });
        if (existing && existing.sta_rnd === CLOSED_STATE_ID) {
            return res.status(409).json({ message: 'No se puede editar una Rendición que está en estado Cerrado.' });
        }

        // Verificar que la fecha no sea futura
        if (fec_rnd && new Date(fec_rnd) > new Date()) {
            return res.status(400).json({ message: 'La fecha de la Rendición no puede ser una fecha futura.' });
        }

        const updated = await renditionModel.updateRenditionModel(cod_rnd, { 
            num_rnd, opg_rnd, fec_rnd, prd_rnd, avs_rnd, sta_rnd, rnt_rnd
        });
        if (!updated) return res.status(404).json({ message: 'Rendición no encontrada o sin cambios' });

        if (opg_rnd) await orderModel.autoUpdateOpgStatus(opg_rnd);

        res.json({ message: 'Rendición actualizada con éxito', data: updated });
    } catch (error) {
        console.error('Error al Editar la Rendición', error);
        res.status(500).json({ message: 'Error al Editar la Rendición' });
    }
};

const deleteRendition = async (req, res) => {
    const { cod_rnd } = req.params;
    try {
        // No eliminar si tiene notas de débito asociadas
        const hasNdb = await renditionModel.renditionHasDebitNotes(cod_rnd);
        if (hasNdb) {
            return res.status(409).json({ message: 'No se puede eliminar esta Rendición porque tiene Notas de Débito asociadas. Elimine primero las notas.' });
        }

        const existing = await renditionModel.getRenditionModel({ cod_rnd });
        const opg_rnd = existing?.opg_rnd;

        const result = await renditionModel.deleteRenditionModel({ cod_rnd });
        if (!result) return res.status(404).json({ message: 'Rendición no encontrada' });

        if (opg_rnd) await orderModel.autoUpdateOpgStatus(opg_rnd);

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