<h1 align="center">
  <br>
  Micro Serviço de Autenticação em NodeJS
  <br>
</h1>

## 💻 Rotas

Usuarios:

| Rotas        | HTTP   | Descrição                     |
| ------------ | ------ | ----------------------------- |
| /users       | GET    | Pega todos os Usuarios        |
| /users       | POST   | Cria um Usuario               |
| /users/:uuid | GET    | Pega um Usuario pelo UUID     |
| /users/:uuid | PUT    | Atualiza um Usuario pelo UUID |
| /users/:uuid | DELETE | Remove um Usuario pelo UUID   |

Autenticação:

| Rotas                 | HTTP   | Description         |
| --------------------- | ------ | ------------------- |
| /token                | POST   | Pega um Token JWT   |
| /token/validate       | POST   | Valida o Token JWT  |

Status:

| Rotas                 | HTTP   | Description         |
| --------------------- | ------ | ------------------- |
| /status               | GET    | Retorna Status 200  |


## 👨‍🏫 Testando

Rode o projeto usando:

```
npm install
npm run build
npm run start
```

ou teste o codigo:

```
npm install
npm run test
```