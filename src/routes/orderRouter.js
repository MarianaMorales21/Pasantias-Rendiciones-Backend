import { Router } from "express"
import { OrderControllers } from "../controllers/orderController.js";

export const router = Router();

router.get("/order", OrderControllers.getOrders);
router.get("/order/:cod_opg", OrderControllers.getOrder);
router.post("/order", OrderControllers.createOrder);
router.put("/order/:cod_opg", OrderControllers.updateOrder);
router.delete("/order/:cod_opg", OrderControllers.deleteOrder);

export default router;