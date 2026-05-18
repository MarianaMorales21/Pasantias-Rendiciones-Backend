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
    const { num_opg, ced_opg, fec_opg, fco_opg, fdc_opg, dcr_opg, mon_opg, con_opg, sta_opg, par_opg } = req.body;
    try {
        const newOrder = await orderModel.createOrderModel({ 
            num_opg, ced_opg, fec_opg, fco_opg, fdc_opg, dcr_opg, mon_opg, con_opg, sta_opg, par_opg
        });
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error al Crear la Orden', error);
        res.status(500).json({ message: 'Error al Crear la Orden' });
    }
};

const updateOrder = async (req, res) => {
    const { cod_opg } = req.params;
    const { num_opg, ced_opg, fec_opg, fco_opg, fdc_opg, dcr_opg, mon_opg, con_opg, sta_opg, par_opg } = req.body;
    try {
        const updatedOrderData = await orderModel.updateOrderModel(cod_opg, { 
            num_opg, ced_opg, fec_opg, fco_opg, fdc_opg, dcr_opg, mon_opg, con_opg, sta_opg, par_opg
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
