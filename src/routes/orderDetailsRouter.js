import { Router } from "express";
import { orderDetailController } from "../controllers/orderDetailsController";

export const router = Router();

router.get("/order-details", orderDetailController.getOrdersDetailsController);
router.get("/order-details/:cod_rnd", orderDetailController.getOrderDetailController);
router.post("/order-details", orderDetailController.createOrderDetailController);
router.put("/order-details/:cod_rnd", orderDetailController.updateOrderDetailController);
router.delete("/order-details/:cod_rnd", orderDetailController.deleteOrderDetailController);

export default router;