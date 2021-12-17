import express from 'express';
import statusRoute from './routes/status.route';
import usersRoute from './routes/users.route';

const PORT = 3333;

const app = express();

// Aplicação
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use(usersRoute);
app.use(statusRoute);

app.listen(PORT, () => console.log(`Executando na porta ${PORT}`));
