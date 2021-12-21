import { Router } from "express";
import type { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import ForbiddenError from "../models/errors/forbidden.error.model";
import basicAuthenticationMiddleware from '../middlewares/basic-authentication.middleware';
import { StatusCodes } from "http-status-codes";
import bearerAuthenticationMiddleware from "../middlewares/bearer-authentication.middleware";

const authorizationRoute = Router();

authorizationRoute.post('/token', basicAuthenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        if (!user) {
            throw new ForbiddenError('Usuário não informado!');
        }

        const jwtPayload = { username: user.username };
        const jwtOptions = { subject: user?.uuid };
        const secretKey = 'Asdw2';

        const jwt = JWT.sign(jwtPayload, secretKey, jwtOptions);

        res.status(StatusCodes.OK).json({ token: jwt });
    }
    catch (error) {
        next(error);
    }
});

authorizationRoute.post('/token/validate', bearerAuthenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(StatusCodes.OK)
    }
    catch (error) {
        next(error);
    }
});

export default authorizationRoute;