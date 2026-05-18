import { debitNoteDetailsModel } from "../models/debitNoteDetailsModel.js";

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

const createDebitNoteDetail = async (req, res) => {
    const { cab_drn, par_drn, des_drn, mon_drn } = req.body;
    try {
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
    const { cab_drn, par_drn, des_drn, mon_drn } = req.body;
    try {
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