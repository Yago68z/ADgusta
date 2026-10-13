# Documentação da API — Fashion Catalog

## Base URL local
`http://localhost:3000`

Após o deploy, substitua pela URL pública fornecida pela Vercel.

## `GET /`
Verifica se a API está online.

Resposta `200`:
```json
{
  "mensagem": "Fashion Catalog API funcionando.",
  "endpoints": ["/roupas", "/roupas/:id"],
  "status": "online"
}
```

## `GET /roupas`
Lista todas as roupas. Retorna um array JSON; se não houver registros, retorna `[]`.

## `GET /roupas/:id`
Busca uma roupa pelo ID MongoDB.
- `200`: encontrada
- `400`: ID inválido
- `404`: roupa não encontrada

## `POST /roupas`
Cadastra uma roupa. Envie `Content-Type: application/json`.

Exemplo:
```json
{
  "marca": "Nike",
  "modelo": "Camiseta Sportswear",
  "preco": 129.9,
  "foto": "https://exemplo.com/camiseta.jpg"
}
```
- `201`: criada
- `400`: campos ausentes ou inválidos
- `500`: falha inesperada

## `PUT /roupas/:id`
Atualiza os campos enviados. O ID vai na URL. Envie um JSON com um ou mais campos `marca`, `modelo`, `preco`, `foto`.
- `200`: atualizada
- `400`: ID ou dados inválidos
- `404`: não encontrada

## `DELETE /roupas/:id`
Exclui a roupa.
- `200`: excluída
- `400`: ID inválido
- `404`: não encontrada

## Testar com curl

Saúde da API:
```bash
curl http://localhost:3000/
```

Listar:
```bash
curl http://localhost:3000/roupas
```

Cadastrar:
```bash
curl -X POST http://localhost:3000/roupas -H "Content-Type: application/json" -d "{\"marca\":\"Nike\",\"modelo\":\"Camiseta\",\"preco\":129.90,\"foto\":\"https://exemplo.com/camiseta.jpg\"}"
```

Para testar PUT e DELETE, use o `_id` retornado pelo cadastro.

## Observação
Os endpoints de roupas precisam de `MONGODB_URI` válida e de acesso ao MongoDB Atlas. A API não usa armazenamento falso em memória.
