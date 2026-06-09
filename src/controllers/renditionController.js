import { renditionModel } from "../models/renditionModel.js";
import { orderModel } from "../models/orderModel.js";
import { stateModel } from "../models/stateModel.js";

const isAdmin = (req) => req.user?.rol === 1;
const isCoordinator = (req) => req.user?.rol === 2;
const getWorkflowStates = async () => ({
    active: await stateModel.getStateByNameModel('Activo'),
    delivered: await stateModel.ensureStateModel('Entregada')
});

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

        // Verificar número de rendición duplicado en la misma OPG
        const duplicado = await renditionModel.checkDuplicateNumRnd(num_rnd, opg_rnd);
        if (duplicado) {
            return res.status(409).json({ message: `El número de Rendición "${num_rnd}" ya existe en esta Orden de Pago.` });
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

        const { active, delivered } = await getWorkflowStates();

        // Verificar si la rendición está entregada
        const existing = await renditionModel.getRenditionModel({ cod_rnd });
        if (!existing) return res.status(404).json({ message: 'Rendición no encontrada' });

        const currentStatus = Number(existing.sta_rnd);
        const nextStatus = Number(sta_rnd);
        const deliveredId = Number(delivered.cod_sta);
        const activeId = Number(active?.cod_sta || 1);

        if (currentStatus === deliveredId) {
            const adminReopening = isAdmin(req) && nextStatus === activeId;
            if (!adminReopening) {
                return res.status(409).json({ message: 'No se puede editar una Rendición entregada. Solo el administrador puede cambiarla a Activo.' });
            }
            num_rnd = existing.num_rnd;
            opg_rnd = existing.opg_rnd;
            fec_rnd = existing.fec_rnd;
            prd_rnd = existing.prd_rnd;
            avs_rnd = existing.avs_rnd;
            rnt_rnd = existing.rnt_rnd;
        }

        if (currentStatus === activeId && nextStatus === deliveredId && !isAdmin(req) && !isCoordinator(req)) {
            return res.status(403).json({ message: 'Solo el administrador o la coordinadora pueden entregar una Rendición.' });
        }

        if (currentStatus === deliveredId && nextStatus !== activeId && !isAdmin(req)) {
            return res.status(403).json({ message: 'Solo el administrador puede cambiar una Rendición entregada a Activo.' });
        }

        // Verificar que la fecha no sea futura
        if (fec_rnd && new Date(fec_rnd) > new Date()) {
            return res.status(400).json({ message: 'La fecha de la Rendición no puede ser una fecha futura.' });
        }

        // Verificar número de rendición duplicado en la misma OPG (excluyendo la actual)
        const duplicado = await renditionModel.checkDuplicateNumRnd(num_rnd, opg_rnd, cod_rnd);
        if (duplicado) {
            return res.status(409).json({ message: `El número de Rendición "${num_rnd}" ya existe en esta Orden de Pago.` });
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
        const delivered = await stateModel.ensureStateModel('Entregada');
        const existing = await renditionModel.getRenditionModel({ cod_rnd });
        if (existing && Number(existing.sta_rnd) === Number(delivered.cod_sta)) {
            return res.status(409).json({ message: 'No se puede eliminar una Rendición entregada.' });
        }

        // No eliminar si tiene notas de débito asociadas
        const hasNdb = await renditionModel.renditionHasDebitNotes(cod_rnd);
        if (hasNdb) {
            return res.status(409).json({ message: 'No se puede eliminar esta Rendición porque tiene Notas de Débito asociadas. Elimine primero las notas.' });
        }

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
