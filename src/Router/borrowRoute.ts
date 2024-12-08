import { Router } from "express";
import { verifyToken } from "../Middleware/authtorization";
import { createValidation, returnValidation, usageValidation } from "../Middleware/borrowValidation";
import { analyzeItemUsage, analyzeUsage, createBorrow, returnItem } from "../Controller/borrowController";
import authorizeAdmin from "../Middleware/authorizeAdmin";

const router = Router()

router.post(`/borrow`, [verifyToken, createValidation], createBorrow)
router.post(`/return`, [verifyToken, returnValidation], returnItem);
router.post(`/usage-report`, [verifyToken, authorizeAdmin, usageValidation], analyzeUsage)
router.post(`/analysis`, [verifyToken, authorizeAdmin], analyzeItemUsage);

export default router