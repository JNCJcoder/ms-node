import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import userRepository from '../repositories/user.repository';

const usersRoute = Router();

usersRoute.get('/users', async (_req: Request, res: Response, _next: NextFunction) => {
    const users = await userRepository.findAll();

    res.status(StatusCodes.OK).json(users);
});

usersRoute.get('/users/:uuid', async (req: Request, res: Response, next: NextFunction) => {
    const { uuid } = req.params;

    const user = await userRepository.findById(uuid);

    res.status(StatusCodes.OK).send(user);
});

usersRoute.post('/users', async (req: Request, res: Response, next: NextFunction) => {
    const newUser = req.body;

    const uuid = await userRepository.create(newUser);

    res.status(StatusCodes.CREATED).send(uuid);
});

usersRoute.put('/users/:uuid', async (req: Request, res: Response, next: NextFunction) => {
    const { uuid } = req.params;
    const modifiedUser = req.body;

    modifiedUser.uuid = uuid;

    await userRepository.update(modifiedUser);

    res.status(StatusCodes.OK);
});

usersRoute.delete('/users/:uuid', async (req: Request, res: Response, next: NextFunction) => {
    const { uuid } = req.params;

    await userRepository.remove(uuid);

    res.status(StatusCodes.OK);
});



export default usersRoute;