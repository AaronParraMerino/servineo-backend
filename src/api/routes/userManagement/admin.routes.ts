import { Router } from "express";
import { loginAdministrador, loginAdminWithGoogle, verifyAdminToken, getDashboardMetrics, getLoginsByDayChart } from "../../controllers/userManagement/admin.controller";
import chartRouter from '../chart.routes';
import { verifyJWT } from "../../../middlewares/authMiddleware";
import { adminOnly } from "../../../middlewares/adminOnly";

const router = Router();

// POST /api/admin
router.post("/login", loginAdministrador);
router.post("/chart", chartRouter);
router.post("/login/google", loginAdminWithGoogle);


router.get("/verify", verifyJWT, adminOnly, verifyAdminToken);
router.get("/metrics", verifyJWT, adminOnly, getDashboardMetrics);
router.get("/charts/logins-by-day", verifyJWT, adminOnly, getLoginsByDayChart);

export default router;
