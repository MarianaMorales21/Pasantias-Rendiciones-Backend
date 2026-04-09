import { Router } from "express"
import { UsersControllers } from "../controllers/usersController.js"

export const router = Router();

router.get("/users", UsersControllers.getUsers);
router.get("/users/:ced_usu", UsersControllers.getUser);
router.post("/users", UsersControllers.createUser);
router.put("/users/:ced_usu", UsersControllers.updateUser);
router.delete("/users/:ced_usu", UsersControllers.deleteUsers);

export default router;