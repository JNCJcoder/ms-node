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
                AND password = crypt($2, $3)
            `

            const values = [username, password, process.env.PASSWDCRYPT];
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
                VALUES ($1, crypt($2, $3))
                RETURNING uuid
            `;

            if (await this.verifyUserExist(user.username)) {
                throw new DatabaseError('Usuario ja existe');
            }

            const values = [user.username, user.password, process.env.PASSWDCRYPT];

            const { rows } = await db.query<{ uuid: string }>(script, values);
            const [newUser] = rows;

            return newUser.uuid;
        } catch (error) {
            throw new DatabaseError('Erro na cria????o de um User', error);
        }
    }

    async verifyUserExist(username: string): Promise<Boolean> {
        const query = `
                SELECT uuid, username
                FROM application_user
                WHERE username = $1
            `
        const values = [username];

        const { rows } = await db.query(query, values);
        return rows[0].username == username;
    }

    async update(user: User): Promise<void> {
        try {
            const script = `
                UPDATE application_user
                SET
                    username = $1,
                    password = crypt($2, $4)
                WHERE uuid = $3
            `;

            if (await this.verifyUserExist(user.username)) {
                throw new DatabaseError('Usuario j?? existe');
            }

            const values = [user.username, user.password, user.uuid, process.env.PASSWDCRYPT];
            await db.query(script, values);
        } catch (error) {
            throw new DatabaseError('Erro na consulta por ID', error);
        }
    }

    async remove(uuid: string): Promise<void> {
        try {
            const script = `
                DELETE FROM application_user
                WHERE uuid = $1
            `;

            const values = [uuid];

            await db.query(script, values);
        } catch (error) {
            throw new DatabaseError('Erro na exclus??o de usuario por ID', error);
        }
    }
}

export default new UserRepository();