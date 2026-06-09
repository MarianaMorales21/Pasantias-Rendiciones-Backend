import { debitNoteDetailsModel } from "../models/debitNoteDetailsModel.js";
import { renditionModel } from "../models/renditionModel.js";

const getRenditionByDebitNote = async (cod_ndb) => {
    return renditionModel.getRenditionByDebitNoteModel(cod_ndb);
};

const getDetailsByDebitNote = async (req, res) => {
    const { cab_drn } = req.params;
    try {
        const details = await debitNoteDetailsModel.getDetailsByDebitNoteModel(cab_drn);
        res.json(details);
    } catch (error) {
        console.error('Error al recuperar detalles', error);
        res.status(500).json({ message: 'Error al recuperar detalles' });
    }
};

const round2 = (n) => Math.round(Number(n) * 100) / 100;

const createDebitNoteDetail = async (req, res) => {
    let { cab_drn, par_drn, des_drn, mon_drn } = req.body;
    try {
        const rendition = await getRenditionByDebitNote(cab_drn);
        if (rendition?.nom_sta === 'Entregada') {
            return res.status(409).json({ message: 'No se pueden crear Detalles de Gasto en una Rendición entregada.' });
        }

        des_drn = (des_drn || '').toUpperCase();

        const amount = round2(mon_drn);
        if (Number.isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'El monto del detalle de gasto debe ser mayor a cero' });
        }

        const validation = await debitNoteDetailsModel.getDetailBudgetModel(cab_drn);
        if (!validation) {
            return res.status(404).json({ message: 'Nota de Débito no encontrada' });
        }

        if (amount > round2(validation.remaining)) {
            return res.status(400).json({
                message: `El monto del detalle excede el disponible de la Nota de Débito. Disponible: Bs. ${validation.remaining.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`
            });
        }

        const newDetail = await debitNoteDetailsModel.createDebitNoteModelDetails({ 
            cab_drn, 
            par_drn, 
            des_drn, 
            mon_drn 
        });
        res.status(201).json(newDetail);
    } catch (error) {
        console.error('Error al crear detalle', error);
        res.status(500).json({ message: 'Error al crear detalle' });
    }
};

const updateDebitNoteDetail = async (req, res) => {
    const { cod_drn } = req.params;
    let { cab_drn, par_drn, des_drn, mon_drn } = req.body;
    try {
        const currentRendition = await renditionModel.getRenditionByDetailModel(cod_drn);
        if (currentRendition?.nom_sta === 'Entregada') {
            return res.status(409).json({ message: 'No se puede editar un Detalle de Gasto de una Rendición entregada.' });
        }

        const targetRendition = await getRenditionByDebitNote(cab_drn);
        if (targetRendition?.nom_sta === 'Entregada') {
            return res.status(409).json({ message: 'No se puede mover un Detalle de Gasto a una Rendición entregada.' });
        }

        des_drn = (des_drn || '').toUpperCase();

        const amount = round2(mon_drn);
        if (Number.isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'El monto del detalle de gasto debe ser mayor a cero' });
        }

        const validation = await debitNoteDetailsModel.getDetailBudgetModel(cab_drn, cod_drn);
        if (!validation) {
            return res.status(404).json({ message: 'Nota de Débito no encontrada' });
        }

        if (amount > round2(validation.remaining)) {
            return res.status(400).json({
                message: `El monto del detalle excede el disponible de la Nota de Débito. Disponible: Bs. ${validation.remaining.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`
            });
        }

        const updated = await debitNoteDetailsModel.updateDebitNoteModelDetails(cod_drn, { 
            cab_drn, 
            par_drn, 
            des_drn, 
            mon_drn 
        });
        res.json({ message: 'Detalle actualizado', data: updated });
    } catch (error) {
        console.error('Error al editar detalle', error);
        res.status(500).json({ message: 'Error al editar detalle' });
    }
};

const deleteDebitNoteDetail = async (req, res) => {
    const { cod_drn } = req.params;
    try {
        const currentRendition = await renditionModel.getRenditionByDetailModel(cod_drn);
        if (currentRendition?.nom_sta === 'Entregada') {
            return res.status(409).json({ message: 'No se puede eliminar un Detalle de Gasto de una Rendición entregada.' });
        }

        await debitNoteDetailsModel.deleteDebitNoteModelDetails({ cod_drn });
        res.json({ message: 'Detalle eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar detalle', error);
        res.status(500).json({ message: 'Error al eliminar detalle' });
    }
};

export const debitNoteDetailsController = {
    getDetailsByDebitNote,
    createDebitNoteDetail,
    updateDebitNoteDetail,
    deleteDebitNoteDetail
};
