# Contexto do Projeto — Fashion Catalog

## Objetivo
Aplicação web para cadastrar, listar, editar e excluir peças de roupas.

## Tecnologias
- Backend: Node.js, Express, Mongoose
- Banco: MongoDB Atlas
- Frontend: HTML, CSS e JavaScript puro
- Hospedagem prevista da API: Vercel

## Dados de cada roupa
- `marca`: texto obrigatório
- `modelo`: texto obrigatório
- `preco`: número maior que zero
- `foto`: URL HTTP/HTTPS

## Endpoints
- `GET /`
- `GET /roupas`
- `GET /roupas/:id`
- `POST /roupas`
- `PUT /roupas/:id`
- `DELETE /roupas/:id`

## Estado atual
- Código inicial do backend e frontend criado.
- Testes automatizados básicos incluídos.
- A conexão real com o MongoDB ainda depende de preencher `backend/.env`.
- O deploy na Vercel ainda não foi realizado.
- O frontend usa `http://localhost:3000` e deverá receber a URL pública depois do deploy.

## Próximas tarefas
1. Instalar dependências com `npm install` dentro de `backend`.
2. Copiar `.env.example` para `.env` e preencher `MONGODB_URI`.
3. Executar `npm test`.
4. Iniciar API e validar CRUD com banco real.
5. Publicar a API na Vercel e alterar `API_URL` em `frontend/script.js`.

## Segurança
Não commitar `.env` nem expor credenciais do MongoDB.
