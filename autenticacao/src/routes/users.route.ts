import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const usersRoute = Router();

usersRoute.get('/users', (req: Request, res: Response, next: NextFunction) => {
    const users = [{
        userName: 'Jorge'
    }];

    res.status(StatusCodes.OK).json(users);
});

usersRoute.get('/users/:uuid', (req: Request, res: Response, next: NextFunction) => {
    const { uuid } = req.params;

    res.status(StatusCodes.OK).send({ uuid });
});

usersRoute.post('/users', (req: Request, res: Response, next: NextFunction) => {
    const newUser = req.body;

    res.status(StatusCodes.CREATED).send(newUser);
});

usersRoute.put('/users/:uuid', (req: Request, res: Response, next: NextFunction) => {
    const { uuid } = req.params;
    const modifiedUser = req.body;

    modifiedUser.uuid = uuid;

    res.status(StatusCodes.OK).send(modifiedUser);
});

usersRoute.delete('/users/:uuid', (req: Request, res: Response, next: NextFunction) => {
    //const { uuid } = req.params;

    res.status(StatusCodes.OK);
});



export default usersRoute;