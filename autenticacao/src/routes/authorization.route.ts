import type { NextFunction, Request, Response } from 'express';
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import type { SignOptions } from 'jsonwebtoken';
import JWT from 'jsonwebtoken';
import basicAuthenticationMiddleware from '../middlewares/basic-authentication.middleware';
import bearerAuthenticationMiddleware from "../middlewares/bearer-authentication.middleware";
import ForbiddenError from "../models/errors/forbidden.error.model";

const authorizationRoute = Router();

authorizationRoute.post('/token', basicAuthenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        if (!user) {
            throw new ForbiddenError('Usuário não informado!');
        }

        const jwtPayload = { username: user.username };
        const jwtOptions: SignOptions = { subject: user?.uuid, expiresIn: '10m' };

        const jwt = JWT.sign(jwtPayload, process.env.SECRET, jwtOptions);

        res.status(StatusCodes.OK).json({ token: jwt });
    }
    catch (error) {
        next(error);
    }
});

authorizationRoute.post('/token/validate', bearerAuthenticationMiddleware, async (_req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(StatusCodes.OK)
    }
    catch (error) {
        next(error);
    }
});

export default authorizationRoute;