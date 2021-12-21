import db from '../db';
import DatabaseError from '../models/errors/database.error.model';
import User from "../models/user.model";

class UserRepository {
    async findAll(): Promise<User[]> {
        try {
            const query = `
                SELECT uuid, username
                FROM application_user
            `
            const { rows } = await db.query<User>(query);

            return rows || [];
        } catch (error) {
            throw new DatabaseError('Erro na consulta por Users', error);
        }
    }

    async findById(uuid: string): Promise<User> {
        try {
            const query = `
                SELECT uuid, username
                FROM application_user
                WHERE uuid = $1
            `
            const values = [uuid];

            const { rows } = await db.query<User>(query, values);
            const [user] = rows;

            return user;
        }
        catch (error) {
            throw new DatabaseError('Erro na consulta por ID', error);
        }
    }

    async findByUsernameAndPassword(username: string, password: string): Promise<User | null> {
        try {
            const query = `
                SELECT uuid, username
                FROM application_user
                WHERE username = $1
                AND password = crypt($2, 'asdw')
            `

            const values = [username, password];
            const { rows } = await db.query(query, values);
            const [user] = rows;

            return user || null;
        }
        catch (error) {
            throw new DatabaseError('Erro na consulta de username e password', error);
        }
    }

    async create(user: User): Promise<string> {
        try {
            const script = `
                INSERT INTO application_user(
                    username,
                    password
                )
                VALUES ($1, crypt($2, 'asdw'))
                RETURNING uuid
            `;

            const values = [user.username, user.password];

            const { rows } = await db.query<{ uuid: string }>(script, values);
            const [newUser] = rows;

            return newUser.uuid;
        } catch (error) {
            throw new DatabaseError('Erro na criação de um User', error);
        }
    }

    async update(user: User): Promise<void> {
        try {
            const script = `
                UPDATE application_user
                SET
                    username = $1,
                    password = crypt($2, 'asdw')
                WHERE uuid = $3
            `;

            const values = [user.username, user.password, user.uuid];
            await db.query(script, values);
        } catch (error) {
            throw new DatabaseError('Erro na consulta por ID', error);
        }
    }

    async remove(uuid: string): Promise<void> {
        try {
            const script = `
                DELETE
                FROM application_user
                WHERE uuid = $1
            `;

            const values = [uuid];

            await db.query(script, values);
        } catch (error) {
            throw new DatabaseError('Erro na exclusão de usuario por ID', error);
        }
    }
}

export default new UserRepository();