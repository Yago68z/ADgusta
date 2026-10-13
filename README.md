# Fashion Catalog

Mini sistema web para gerenciamento de peças de roupas, com marca, modelo, preço e foto.

## Tecnologias
- Node.js + Express
- MongoDB Atlas + Mongoose
- HTML, CSS e JavaScript
- Vercel (deploy planejado da API)

## Requisitos
- Node.js LTS instalado
- Conta MongoDB Atlas
- Opcional: conta Vercel para publicar

## Instalação local

1. Abra um terminal na pasta `backend`.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Copie `.env.example` para `.env`.
4. Preencha `MONGODB_URI` com sua string real do MongoDB Atlas.
5. Inicie a API:
   ```bash
   npm start
   ```
6. Acesse `http://localhost:3000/` para conferir a rota de saúde.
7. Abra `frontend/index.html` no navegador. Se o navegador bloquear requisições locais, use uma extensão/servidor estático ou VS Code Live Server.

## Testes
Na pasta `backend`, execute:
```bash
npm test
```
Os testes incluídos verificam a rota de saúde e a resposta 404. O CRUD completo exige MongoDB configurado e deve ser testado com banco real.

## Configurar MongoDB Atlas
- Crie um cluster e um usuário de banco de dados.
- Autorize o IP do computador em Network Access (para teste, evite manter acesso aberto permanentemente).
- Copie a connection string e substitua usuário, senha e nome do banco.
- Coloque a string apenas em `backend/.env`.

## Deploy da API na Vercel
1. Envie o projeto para um repositório Git.
2. Importe o repositório na Vercel.
3. Configure o diretório raiz do projeto para `backend` (ou ajuste conforme a estrutura escolhida).
4. Cadastre `MONGODB_URI` nas variáveis de ambiente do projeto na Vercel.
5. Faça o deploy e teste a URL `/`.
6. Copie a URL publicada e altere `API_URL` no início de `frontend/script.js`.
7. Publique a pasta `frontend` como site estático em um serviço de hospedagem estática.

## Documentação
- `Roadmap.md`: etapas do projeto
- `Contexto.md`: estado e pendências
- `api.md`: documentação dos endpoints

## Segurança
Nunca publique o arquivo `.env` nem compartilhe credenciais do banco.
