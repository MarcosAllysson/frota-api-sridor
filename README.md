# Frota API

API REST para controle de utilização de automóveis de uma empresa (Node.js + Express, persistência em memória).

## Requisitos

- Node.js 18+

## Como executar

```bash
npm install
npm start        # http://localhost:3000
npm run dev      # com reload automático
```

## Como testar

```bash
npm test
```

## Arquitetura

`routes → controllers → services → repositories (em memória)`

- **routes/controllers**: camada HTTP, sem regra de negócio.
- **services**: validações e regras de negócio.
- **repositories**: persistência em memória (`InMemoryRepository`), fácil de trocar por um banco.
- **middlewares/errorHandler**: converte `AppError` em respostas JSON `{ "erro": "..." }`.

## Regras de negócio

- Um automóvel só pode ser utilizado por um motorista por vez.
- Um motorista não pode utilizar mais de um automóvel ao mesmo tempo.
- Placa única por automóvel.
- Não é possível excluir automóvel/motorista que esteja em utilização.

## Endpoints

| Método | Rota                       | Descrição                                                             |
| ------ | -------------------------- | --------------------------------------------------------------------- |
| POST   | /automoveis                | Cadastra automóvel `{ placa, cor, marca }`                            |
| GET    | /automoveis?cor=&marca=    | Lista (filtros opcionais)                                             |
| GET    | /automoveis/:id            | Recupera por id                                                       |
| PUT    | /automoveis/:id            | Atualiza                                                              |
| DELETE | /automoveis/:id            | Exclui                                                                |
| POST   | /motoristas                | Cadastra motorista `{ nome }`                                         |
| GET    | /motoristas?nome=          | Lista (filtro por nome)                                               |
| GET    | /motoristas/:id            | Recupera por id                                                       |
| PUT    | /motoristas/:id            | Atualiza                                                              |
| DELETE | /motoristas/:id            | Exclui                                                                |
| POST   | /utilizacoes               | Inicia utilização `{ motoristaId, automovelId, motivo, dataInicio? }` |
| PATCH  | /utilizacoes/:id/finalizar | Finaliza utilização `{ dataFim? }`                                    |
| GET    | /utilizacoes               | Lista com dados do motorista e do automóvel                           |

`dataInicio` e `dataFim` são opcionais (padrão: agora) e devem estar em ISO 8601.

## Exemplo rápido

```bash
curl -X POST localhost:3000/automoveis -H "Content-Type: application/json" \
  -d '{"placa":"ABC1D23","cor":"Preto","marca":"Fiat"}'
curl -X POST localhost:3000/motoristas -H "Content-Type: application/json" -d '{"nome":"João"}'
curl -X POST localhost:3000/utilizacoes -H "Content-Type: application/json" \
  -d '{"motoristaId":"<ID>","automovelId":"<ID>","motivo":"Visita a cliente"}'
```
