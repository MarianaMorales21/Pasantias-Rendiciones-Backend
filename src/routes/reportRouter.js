import { Router } from "express";
import { 
    getRenditionList, 
    getDetailedReport, 
    getActaReport,
    getFullOPGReport, // Nuevo controlador para el historial completo
    getDashboardStats,
    getOPGExecutionByRendition,
} from "../controllers/reportsController.js";

const router = Router();

router.get('/reports/opg/execution/:cod_rnd', getOPGExecutionByRendition);

// --- SELECTORES Y LISTADOS ---
// Obtiene la lista de rendiciones activas para llenar el select del frontend
router.get('/reports/renditions', getRenditionList);

// --- REPORTES ESPECÍFICOS POR RENDICIÓN ---
// Datos para la tabla detallada de una rendición (agrupado por programa)
router.get('/reports/detailed/:cod_rnd', getDetailedReport);

// Genera el texto y datos para el Acta de Entrega (formato formal)
router.get('/reports/acta/:cod_rnd', getActaReport);

// --- REPORTES POR ORDEN DE PAGO (NUEVO) ---
// Obtiene todas las rendiciones y gastos asociados a una OPG específica
router.get('/reports/opg/:cod_opg', getFullOPGReport);

// --- ESTADÍSTICAS DEL DASHBOARD ---
router.get('/reports/dashboard-stats', getDashboardStats);

export default router;