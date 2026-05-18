import 'dotenv/config';
import express from "express";
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

const app = express();

// Seguridad Global
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: 'GET, PUT, POST, DELETE, HEAD, PATCH'
}));

// Limitador de peticiones (Rate Limit)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite de 100 peticiones por ventana
    message: "Demasiadas peticiones desde esta IP, por favor intente de nuevo más tarde."
});

app.get('/', (req, res) => {
    res.send('Servidor de Pasantías funcionando correctamente');
});

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

app.listen(port, () => {
    console.log("Server on port", port);
});