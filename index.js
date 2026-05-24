import 'dotenv/config';
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import { port } from "./src/config.js";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import './src/database/connection.database.js'; 

import AuthRouters from './src/routes/authRouter.js';
import UserRouters from './src/routes/userRoutes.js';
import ProgramsRouters from './src/routes/programsRoutes.js';
import BeneficiaryRouters from './src/routes/beneficiaryRouter.js';
import AccountantRouters from './src/routes/accountantRouter.js';
import OrganizationRouters from './src/routes/organizationRouter.js';
import OrderRouters from './src/routes/orderRouter.js';
import DepartureRouters from './src/routes/departureRouter.js';
import RenditionRouters from './src/routes/renditionRouter.js';
import DebitNoteRouters from './src/routes/debitNoteRouter.js';
import StateRouters from './src/routes/stateRouter.js';
import ReportsRouters from './src/routes/reportRouter.js'
import DebitNoteDetailsRouters from './src/routes/debitNoteDetailsRouter.js';
import AuthoritiesRouter from './src/routes/authoritiesRouter.js'

import { verifyToken, authorizeRoles } from './src/middlewares/jwt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Seguridad Global
const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:3000', 'http://localhost:5173'];
app.use(helmet());
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET, PUT, POST, DELETE, HEAD, PATCH'
}));

// Limitador de peticiones (Rate Limit)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Demasiadas peticiones desde esta IP, por favor intente de nuevo más tarde."
});

// En producción, servir archivos estáticos del frontend
const staticDir = process.env.STATIC_DIR || path.join(__dirname, '..', 'Pasantias-Frontend', 'dist');
app.use(express.static(staticDir));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Rutas Públicas
app.use('/api/auth', limiter, AuthRouters);

// Rutas Protegidas (Requieren Token y Validación de Roles)
app.use('/api', verifyToken, authorizeRoles(), [
    UserRouters,
    ProgramsRouters,
    BeneficiaryRouters,
    AccountantRouters,
    OrganizationRouters,
    OrderRouters,
    DepartureRouters,
    RenditionRouters,
    DebitNoteRouters,
    DebitNoteDetailsRouters,
    StateRouters,
    ReportsRouters,
    AuthoritiesRouter
]);

// SPA fallback: redirigir cualquier ruta no-API al index.html del frontend
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(staticDir, 'index.html'));
    }
});

app.listen(port, () => {
    console.log("Server on port", port);
});