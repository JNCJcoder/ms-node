import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import userRepository from '../repositories/user.repository';

const usersRoute = Router();

usersRoute.get('/users', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userRepository.findAll();
        res.status(StatusCodes.OK).json(users);
    }
    catch (error) {
        next(error);
    }
});

usersRoute.get('/users/:uuid', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { uuid } = req.params;
        const user = await userRepository.findById(uuid);
        res.status(StatusCodes.OK).send(user);
    }
    catch (error) {
        next(error);
    }
});

usersRoute.post('/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = req.body;
        const uuid = await userRepository.create(newUser);
        res.status(StatusCodes.CREATED).json({ uuid });
    }
    catch (error) {
        next(error);
    }
});

usersRoute.put('/users/:uuid', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { uuid } = req.params;
        const modifiedUser = req.body;

        modifiedUser.uuid = uuid;

        await userRepository.update(modifiedUser);

        res.sendStatus(StatusCodes.OK);
    }
    catch (error) {
        next(error);
    }
});

usersRoute.delete('/users/:uuid', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { uuid } = req.params;
        await userRepository.remove(uuid);
        res.sendStatus(StatusCodes.OK);
    }
    catch (error) {
        next(error);
    }
});



export default usersRoute;