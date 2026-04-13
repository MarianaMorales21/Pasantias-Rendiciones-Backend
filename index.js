import express from "express";
import { port } from "./src/config.js";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import './src/database/connection.database.js'; 
import UserRouters from './src/routes/userRoutes.js'
import ProgramsRouters from './src/routes/programsRoutes.js'
import BeneficiaryRouters from './src/routes/beneficiaryRouter.js'
import AccountantRouters from './src/routes/accountantRouter.js'
import OrganizationRouters from './src/routes/organizationRouter.js'
import OrderRouters from './src/routes/orderRouter.js'
const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: 'GET, PUT, POST, DELETE, HEAD, PATCH'
}));

app.get('/', (req, res) => {
    res.send('Servidor de Pasantías funcionando correctamente');
});

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(UserRouters);
app.use(ProgramsRouters);
app.use(BeneficiaryRouters)
app.use(AccountantRouters);
app.use(OrganizationRouters);
app.use(OrderRouters);

app.listen(port, () => {
    console.log("Server on port", port);
});