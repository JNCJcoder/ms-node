import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const statusRoute = Router();

statusRoute.get('/status', (_req: Request, res: Response, _next: NextFunction) => {
    res.status(StatusCodes.OK).send("Sucesso!");
});

export default statusRoute;