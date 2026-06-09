import { orderModel } from "../models/orderModel.js";

const getOrders = async (req, res) => {
    try {
        const orders = await orderModel.getOrdersModel();
        res.json(orders);
    } catch (error) {
        console.error('Error al Recuperar las Ordenes', error);
        res.status(500).json({ message: 'Error al Recuperar las Ordenes' });
    }
};

const getOrder = async (req, res) => {
    const { cod_opg } = req.params;
    try {
        const order = await orderModel.getOrderModel({ cod_opg });
        if (!order) {
            return res.status(404).json({ message: 'Orden no Encontrada' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error al Recuperar la Orden', error);
        res.status(500).json({ message: 'Error al Recuperar la Orden' });
    }
};

const createOrder = async (req, res) => {
    let { num_opg, ctd_opg, fec_opg, fco_opg, fdc_opg, dcr_opg, mon_opg, con_opg, sta_opg, par_opg, gac_opg } = req.body;
    try {
        if (!mon_opg || Number(mon_opg) <= 0) {
            return res.status(400).json({ message: 'El monto de la Orden de Pago debe ser mayor a cero.' });
        }

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (fec_opg && new Date(fec_opg) > today) {
            return res.status(400).json({ message: 'La fecha de emisión no puede ser posterior a la fecha actual.' });
        }

        if (fdc_opg && new Date(fdc_opg) > today) {
            return res.status(400).json({ message: 'La fecha del decreto no puede ser posterior a la fecha actual.' });
        }

        if (fdc_opg && fec_opg && new Date(fdc_opg) > new Date(fec_opg)) {
            return res.status(400).json({ message: 'La fecha del decreto no puede ser posterior a la fecha de la Orden de Pago.' });
        }

        if (fco_opg) {
            if (new Date(fco_opg) > today) {
                return res.status(400).json({ message: 'La fecha de cobro no puede ser posterior a la fecha actual.' });
            }
            if (fec_opg && new Date(fco_opg) < new Date(fec_opg)) {
                return res.status(400).json({ message: 'La fecha de cobro no puede ser anterior a la fecha de emisión.' });
            }
        }

        con_opg = (con_opg || '').toUpperCase();

        const isDuplicate = await orderModel.checkDuplicateNumOpg(num_opg);
        if (isDuplicate) {
            return res.status(409).json({ message: `Ya existe una Orden de Pago con el número "${num_opg}". El número de orden debe ser único.` });
        }

        const newOrder = await orderModel.createOrderModel({
            num_opg, ctd_opg, fec_opg, fco_opg, fdc_opg, dcr_opg, mon_opg, con_opg, sta_opg, par_opg, gac_opg
        });
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error al Crear la Orden', error);
        res.status(500).json({ message: 'Error al Crear la Orden' });
    }
};

const updateOrder = async (req, res) => {
    const { cod_opg } = req.params;
    let { num_opg, ctd_opg, fec_opg, fco_opg, fdc_opg, dcr_opg, mon_opg, con_opg, sta_opg, par_opg, gac_opg } = req.body;
    try {
        if (!mon_opg || Number(mon_opg) <= 0) {
            return res.status(400).json({ message: 'El monto de la Orden de Pago debe ser mayor a cero.' });
        }

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (fec_opg && new Date(fec_opg) > today) {
            return res.status(400).json({ message: 'La fecha de emisión no puede ser posterior a la fecha actual.' });
        }

        if (fdc_opg && new Date(fdc_opg) > today) {
            return res.status(400).json({ message: 'La fecha del decreto no puede ser posterior a la fecha actual.' });
        }

        if (fdc_opg && fec_opg && new Date(fdc_opg) > new Date(fec_opg)) {
            return res.status(400).json({ message: 'La fecha del decreto no puede ser posterior a la fecha de la Orden de Pago.' });
        }

        if (fco_opg) {
            if (new Date(fco_opg) > today) {
                return res.status(400).json({ message: 'La fecha de cobro no puede ser posterior a la fecha actual.' });
            }
            if (fec_opg && new Date(fco_opg) < new Date(fec_opg)) {
                return res.status(400).json({ message: 'La fecha de cobro no puede ser anterior a la fecha de emisión.' });
            }
        }

        con_opg = (con_opg || '').toUpperCase();

        const isDuplicate = await orderModel.checkDuplicateNumOpg(num_opg, cod_opg);
        if (isDuplicate) {
            return res.status(409).json({ message: `Ya existe otra Orden de Pago con el número "${num_opg}". El número de orden debe ser único.` });
        }

        const existingOrder = await orderModel.getOrderModel({ cod_opg });
        if (!existingOrder) {
            return res.status(404).json({ message: 'Orden no Encontrada' });
        }

        const round2 = (n) => Math.round(Number(n) * 100) / 100;
        const currentAmount = round2(mon_opg);
        const existingAmount = round2(existingOrder.mon_opg);
        if (currentAmount < existingAmount) {
            const netSpent = round2(await orderModel.getOpgNetSpent(cod_opg));
            if (currentAmount < netSpent) {
                return res.status(400).json({
                    message: `No se puede reducir el monto de la Orden de Pago por debajo de lo ya rendido (Bs. ${netSpent.toLocaleString("es-VE", { minimumFractionDigits: 2 })}).`
                });
            }
        }

        const updatedOrderData = await orderModel.updateOrderModel(cod_opg, {
            num_opg, ctd_opg, fec_opg, fco_opg, fdc_opg, dcr_opg, mon_opg, con_opg, sta_opg, par_opg, gac_opg
        });

        if (!updatedOrderData) {
            return res.status(404).json({ message: 'Orden no Encontrada o no se realizaron cambios' });
        }
        res.json({ message: 'Orden actualizada con éxito', data: updatedOrderData });
    } catch (error) {
        console.error('Error al Editar la Orden', error);
        res.status(500).json({ message: 'Error al Editar la Orden' });
    }
};

const deleteOrder = async (req, res) => {
    const { cod_opg } = req.params;
    try {
        const hasRnd = await orderModel.opgHasRenditions(cod_opg);
        if (hasRnd) {
            return res.status(409).json({ message: 'No se puede eliminar esta Orden de Pago porque tiene Rendiciones asociadas. Elimine primero las rendiciones.' });
        }

        const isDelete = await orderModel.deleteOrderModel({ cod_opg });
        if (!isDelete) {
            return res.status(404).json({ message: 'No se encontró la Orden' });
        }
        res.status(200).json({ message: 'Orden Eliminada con Éxito' });
    } catch (error) {
        console.error('Error al Eliminar la Orden', error);
        res.status(500).json({ message: 'Error al Eliminar la Orden' });
    }
};

export const OrderControllers = {
    getOrder,
    getOrders,
    createOrder,
    deleteOrder,
    updateOrder,
};
