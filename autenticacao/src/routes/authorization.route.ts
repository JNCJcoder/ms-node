import type { NextFunction, Request, Response } from 'express';
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import type { SignOptions } from 'jsonwebtoken';
import JWT from 'jsonwebtoken';
import basicAuthenticationMiddleware from '../middlewares/basic-authentication.middleware';
import bearerAuthenticationMiddleware from "../middlewares/bearer-authentication.middleware";

const authorizationRoute = Router();

authorizationRoute.post('/token', basicAuthenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const jwtPayload = { username: user.username };
    const jwtOptions: SignOptions = { subject: user?.uuid, expiresIn: '10m' };

    const jwt = JWT.sign(jwtPayload, process.env.SECRET, jwtOptions);

    res.status(StatusCodes.OK).json({ token: jwt });
});


authorizationRoute.post('/token/validate', bearerAuthenticationMiddleware, async (_req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(StatusCodes.OK);
});

export default authorizationRoute;