import { orderDetailModel } from "../models/orderDetailsMode";

const getOrdersDetailsController = async (req, res) => {
    try {
        const ordersDetails = await orderDetailModel.getOrdersDetailsModel();
        res.json(ordersDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderDetailController = async (req, res) => {
    try {
        const orderDetail = await orderDetailModel.getOrderDetailModel(req.params.cod_rnd);
        res.json(orderDetail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createOrderDetailController = async (req, res) => {
    try {
        const orderDetail = await orderDetailModel.createOrderDetailModel(req.body);
        res.json(orderDetail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderDetailController = async (req, res) => {
    try {
        const orderDetail = await orderDetailModel.updateOrderDetailModel(req.params.cod_rnd, req.body);
        res.json(orderDetail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOrderDetailController = async (req, res) => {
    try {
        const orderDetail = await orderDetailModel.deleteOrderDetailModel(req.params.cod_rnd);
        res.json(orderDetail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const orderDetailController = {
    getOrdersDetailsController,
    getOrderDetailController,
    createOrderDetailController,
    updateOrderDetailController,
    deleteOrderDetailController,
};