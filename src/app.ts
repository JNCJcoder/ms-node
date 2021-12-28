require('dotenv').config();
import express from 'express';
import bearerAuthenticationMiddleware from './middlewares/bearer-authentication.middleware';
import errorHandler from './middlewares/error-handler.middleware';
import authorizationRoute from './routes/authorization.route';
import statusRoute from './routes/status.route';
import usersRoute from './routes/users.route';

const app = express();

// Aplicação
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use(statusRoute);
app.use(authorizationRoute);
app.use(bearerAuthenticationMiddleware, usersRoute);

// Error Handler
app.use(errorHandler);

export default app;
