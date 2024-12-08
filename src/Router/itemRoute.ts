import { Router } from "express";
import { verifyToken } from "../Middleware/authtorization";
import { createItems, deleteItem, readItems, updateItem } from "../Controller/itemController";
import { createValidation, updateValidation } from "../Middleware/itemValidation";
import authorizeAdmin from "../Middleware/authorizeAdmin";

const router = Router()

router.post('/inventory', [verifyToken, authorizeAdmin, createValidation], createItems)
router.get('/inventory/:id?', [verifyToken], readItems)
router.put('/inventory/:id', [verifyToken, authorizeAdmin, updateValidation], updateItem)
router.delete('/inventory/:id', [verifyToken, authorizeAdmin], deleteItem)

export default router