import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '../src/app';

const expectedUUID = { uuid: '5f50552d-86e6-49eb-9da2-d927680af814' };

const expectedAuth = {
    username: 'superSu',
    password: 'superSu'
}

const expectedValue = {
    rows: [{
        ...expectedUUID,
        ...expectedAuth
    }]
};

jest.mock('pg-pool');

describe('Routes', () => {
    const request = supertest(app);
    let token: string;

    describe('Status Route', () => {
        it('GET /status', async () => {
            const response = await request
                .get('/status');

            expect(response.statusCode).toEqual(StatusCodes.OK);
        });
    });

    describe('Happy Path', () => {
        describe('Authorization Route', () => {
            it('POST /token', async () => {
                const response = await request
                    .post('/token')
                    .auth(expectedAuth.username, expectedAuth.password);

                token = 'Bearer ' + response.body.token;
                expect(response.statusCode).toEqual(StatusCodes.OK);
                expect(response.body.token).toBeDefined();
            });

            it('POST /token/validate', async () => {
                const response = await request
                    .post('/token/validate')
                    .set('authorization', token);

                expect(response.statusCode).toEqual(StatusCodes.OK);
            });
        });

        describe('Users Route', () => {
            it('GET /users', async () => {
                const response = await request
                    .get('/users')
                    .set('authorization', token);

                expect(response.statusCode).toEqual(StatusCodes.OK);
                expect(response.body).toEqual(expectedValue.rows);
            });

            it('GET /users/:uuid', async () => {
                const response = await request
                    .get(`/users/${expectedUUID.uuid}`)
                    .set('authorization', token);

                expect(response.statusCode).toEqual(StatusCodes.OK);
                expect(response.body).toEqual(expectedValue.rows[0]);
            });

            it('POST /users', async () => {
                const response = await request
                    .post('/users')
                    .set('authorization', token)
                    .send({ username: 'antonio', password: 'Antonio2' });

                expect(response.statusCode).toEqual(StatusCodes.CREATED);
                expect(response.body.uuid).toBeDefined();
            });

            it('PUT /users/:uuid', async () => {
                const response = await request
                    .put(`/users/${expectedUUID.uuid}`)
                    .set('authorization', token)
                    .send({ username: 'antonio', password: 'Passarinho2' });

                expect(response.statusCode).toEqual(StatusCodes.NO_CONTENT);
            });

            it('DELETE /users/:uuid', async () => {
                const response = await request
                    .del(`/users/${expectedUUID.uuid}`)
                    .set('authorization', token);

                expect(response.statusCode).toEqual(StatusCodes.NO_CONTENT);
            });
        });

    });

    describe('Unhappy Path', () => {
        describe('Authorization Route', () => {
            it('POST /token - Login/Senha invalido', async () => {
                const response = await request
                    .post('/token')
                    .auth('loginErrado', 'senhaErrada');

                expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
            });

            it('POST /token - Login e/ou Senha ausente', async () => {
                const response = await request
                    .post('/token');

                expect(response.statusCode).toEqual(StatusCodes.FORBIDDEN);
            });

            it('POST /token/validate - Token invalido', async () => {
                const response = await request
                    .post('/token/validate')
                    .set('authorization', "Bearer 8f52552d-86d6-4deb-9da2d927a80ef841");

                expect(response.statusCode).toEqual(StatusCodes.FORBIDDEN);
            });
        });

        describe('Users Route', () => {

            it('GET /users/:uuid - UUID invalido', async () => {
                const response = await request
                    .get(`/users/123`)
                    .set('authorization', token);

                expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
            });

            it('POST /users - Usuario já existente', async () => {
                const response = await request
                    .post('/users')
                    .set('authorization', token)
                    .send(expectedAuth);

                expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
            });

            it('PUT /users - Usuario já existente', async () => {
                const response = await request
                    .put('/users/${expectedUUID.uuid}')
                    .set('authorization', token)
                    .send(expectedAuth);

                expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
            });

            it('DELETE /users/:uuid -  UUID invalido', async () => {
                const response = await request
                    .del(`/users/123`)
                    .set('authorization', token);

                expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
            });
        });
    });
});