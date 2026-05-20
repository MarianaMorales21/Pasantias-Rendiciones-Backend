import { debitNoteModel } from "../models/debitNoteModel.js";

const getDebitNotes = async (req, res) => {
    try {
        const debitNotes = await debitNoteModel.getDebitNotesModel();
        res.json(debitNotes);
    } catch (error) {
        console.error('Error al Recuperar las Notas de Debito', error);
        res.status(500).json({ message: 'Error al Recuperar las Notas de Debito' });
    }
};

const getDebitNotesByRendition = async (req, res) => {
    const { cod_rnd } = req.params;
    try {
        const debitNotes = await debitNoteModel.getDebitNotesByRenditionModel(cod_rnd);
        res.json(debitNotes);
    } catch (error) {
        console.error('Error al Recuperar las Notas de Debito por Rendición', error);
        res.status(500).json({ message: 'Error al Recuperar las Notas de Debito por Rendición' });
    }
};

const getDebitNote = async (req, res) => {
    const { cod_ndb } = req.params;
    try {
        const debitNote = await debitNoteModel.getDebitNoteModel({ cod_ndb });
        if (!debitNote) return res.status(404).json({ message: 'Nota de Debito no encontrada' });
        res.json(debitNote);
    } catch (error) {
        console.error('Error al Recuperar la Nota de Debito', error);
        res.status(500).json({ message: 'Error al Recuperar la Nota de Debito' });
    }
};

const validateDebitNoteAmount = async (rnd_ndb, mon_ndb, excludedCodNdb = null) => {
    const budget = await debitNoteModel.getDebitNoteBudgetModel(rnd_ndb, excludedCodNdb);
    if (!budget) {
        return { valid: false, message: 'Rendición no encontrada' };
    }

    const amount = Number(mon_ndb);
    if (Number.isNaN(amount) || amount <= 0) {
        return { valid: false, message: 'El monto de la Nota de Debito debe ser mayor a cero' };
    }

    if (amount > budget.remaining) {
        return {
            valid: false,
            message: `El monto de la Nota de Debito excede el disponible de la Orden de Pago. Disponible: Bs. ${budget.remaining.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`
        };
    }

    return { valid: true };
};

const createDebitNote = async (req, res) => {
    const { num_ndb, fec_ndb, rif_ndb, rnd_ndb, con_ndb, mon_ndb, ban_ndb, ref_ndb, pro_ndb, rtc_ndb, tbf_ndb, isl_ndb, sub_ndb } = req.body;
    try {
        // Validar número de nota no duplicado
        const isDuplicate = await debitNoteModel.checkDuplicateNumNdb(num_ndb);
        if (isDuplicate) {
            return res.status(409).json({ message: `Ya existe una Nota de Débito con el número "${num_ndb}". El número de nota debe ser único.` });
        }

        // Validar monto
        const validation = await validateDebitNoteAmount(rnd_ndb, mon_ndb);
        if (!validation.valid) {
            return res.status(400).json({ message: validation.message });
        }

        const newDebitNote = await debitNoteModel.createDebitNoteModel({
            num_ndb, fec_ndb, rif_ndb, rnd_ndb, con_ndb, mon_ndb, ban_ndb,
            ref_ndb, pro_ndb, rtc_ndb, tbf_ndb, isl_ndb, sub_ndb
        });
        res.status(201).json(newDebitNote);
    } catch (error) {
        console.error('Error al Crear la Nota de Debito', error);
        res.status(500).json({ message: 'Error al Crear la Nota de Debito' });
    }
};

const updateDebitNote = async (req, res) => {
    const { cod_ndb } = req.params;
    const { num_ndb, fec_ndb, rif_ndb, rnd_ndb, con_ndb, mon_ndb, ban_ndb, ref_ndb, pro_ndb, rtc_ndb, tbf_ndb, isl_ndb, sub_ndb } = req.body;
    try {
        // Validar número de nota no duplicado (excluyendo la propia)
        const isDuplicate = await debitNoteModel.checkDuplicateNumNdb(num_ndb, cod_ndb);
        if (isDuplicate) {
            return res.status(409).json({ message: `Ya existe otra Nota de Débito con el número "${num_ndb}". El número de nota debe ser único.` });
        }

        // Obtener la nota de débito existente para verificar el monto
        const existingNote = await debitNoteModel.getDebitNoteModel({ cod_ndb });
        if (!existingNote) {
            return res.status(404).json({ message: 'Nota de Débito no encontrada' });
        }

        // Si se intenta reducir el monto y la nota ya tiene detalles de gasto, denegar
        if (Number(mon_ndb) < Number(existingNote.mon_ndb)) {
            const hasDetails = await debitNoteModel.debitNoteHasDetails(cod_ndb);
            if (hasDetails) {
                return res.status(400).json({ 
                    message: 'No se puede reducir el monto de la Nota de Débito porque ya tiene Detalles de Gasto registrados.' 
                });
            }
        }

        // Validar monto
        const validation = await validateDebitNoteAmount(rnd_ndb, mon_ndb, cod_ndb);
        if (!validation.valid) {
            return res.status(400).json({ message: validation.message });
        }

        const updated = await debitNoteModel.updateDebitNoteModel(cod_ndb, {
            num_ndb, fec_ndb, rif_ndb, rnd_ndb, con_ndb, mon_ndb, ban_ndb,
            ref_ndb, pro_ndb, rtc_ndb, tbf_ndb, isl_ndb, sub_ndb
        });
        if (!updated) return res.status(404).json({ message: 'Nota de Debito no encontrada o sin cambios' });
        res.json({ message: 'Nota de Debito actualizada con éxito', data: updated });
    } catch (error) {
        console.error('Error al Editar la Nota de Debito', error);
        res.status(500).json({ message: 'Error al Editar la Nota de Debito' });
    }
};

const deleteDebitNote = async (req, res) => {
    const { cod_ndb } = req.params;
    try {
        // No eliminar si tiene detalles asociados
        const hasDetails = await debitNoteModel.debitNoteHasDetails(cod_ndb);
        if (hasDetails) {
            return res.status(409).json({ message: 'No se puede eliminar esta Nota de Débito porque tiene Detalles de Gasto asociados. Elimine primero los detalles.' });
        }

        const result = await debitNoteModel.deleteDebitNoteModel({ cod_ndb });
        if (!result) return res.status(404).json({ message: 'Nota de Debito no encontrada' });
        res.json({ message: 'Nota de Debito eliminada con éxito' });
    } catch (error) {
        console.error('Error al Eliminar la Nota de Debito', error);
        res.status(500).json({ message: 'Error al Eliminar la Nota de Debito' });
    }
};

export const debitNoteController = {
    getDebitNotes,
    getDebitNotesByRendition,
    getDebitNote,
    createDebitNote,
    updateDebitNote,
    deleteDebitNote,
};
