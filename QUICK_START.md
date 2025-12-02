# Guia Rápido - DirectCash

## Iniciar o Sistema

### 1. Verificar se Docker está instalado e WSL integração configurada

```bash
docker --version
```

Se Docker não estiver disponível, instale Docker Desktop e ative WSL 2 integration nas configurações.

### 2. Iniciar PostgreSQL

```bash
docker compose up -d
```

Aguardar 5 segundos para container inicializar:

```bash
sleep 5
```

### 3. Executar Migrations

```bash
npm run migrate
```

Quando solicitado nome da migration, pressione Enter (aceita default "init").

### 4. Iniciar Servidor

```bash
npm run dev
```

### 5. Acessar Dashboard

Abra no navegador: **http://localhost:3000**

---

## Testar API via cURL

### Criar evento via POST

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "name": "João Silva",
    "email": "joao@example.com",
    "value": 199.90
  }'
```

### Criar evento via GET

```bash
curl "http://localhost:3000/api/events/add?type=upsell&name=Maria%20Santos&email=maria@example.com&value=97.00"
```

### Listar eventos (últimos 7 dias)

```bash
curl http://localhost:3000/api/events
```

### Listar eventos com filtro

```bash
curl "http://localhost:3000/api/events?date_from=2025-11-25&date_to=2025-12-02"
```

---

## Parar o Sistema

### Parar servidor (Ctrl+C no terminal do npm run dev)

### Parar PostgreSQL

```bash
docker compose down
```

---

## Comandos Úteis

### Ver logs do PostgreSQL

```bash
docker compose logs -f postgres
```

### Acessar Prisma Studio (GUI do banco)

```bash
npm run studio
```

Abre em: http://localhost:5555

### Recriar banco de dados

```bash
docker compose down -v
docker compose up -d
sleep 5
npm run migrate
```

---

## Estrutura de Pastas

```
directcash/
├── prisma/           # Schema e migrations do banco
├── public/           # Frontend (HTML, CSS, JS)
├── src/
│   ├── database/     # Cliente Prisma
│   ├── routes/       # Endpoints da API
│   ├── services/     # Lógica de negócio
│   ├── types/        # TypeScript types
│   ├── validations/  # Schemas Zod
│   └── server.ts     # Entry point
└── volumes/          # Dados do PostgreSQL
```

---

## Troubleshooting

### Erro: "Cannot find module"

```bash
npm install
npx prisma generate
```

### Erro: "Connection refused" ao conectar no banco

```bash
docker compose ps
docker compose up -d
sleep 5
```

### Porta 3000 já em uso

Edite `.env` e altere `PORT=3001`

### Frontend não carrega

Acesse via http://localhost:3000 (não abra index.html diretamente)
