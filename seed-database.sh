#!/bin/bash

echo "Populando banco de dados com eventos de teste..."
echo ""

echo "1. Criando evento de payment (POST JSON)..."
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "name": "João Silva",
    "email": "joao.silva@example.com",
    "value": 299.90,
    "timestamp": "2025-11-28T10:30:00Z"
  }'
echo -e "\n"

echo "2. Criando evento de upsell (POST JSON)..."
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "upsell",
    "name": "João Silva",
    "email": "joao.silva@example.com",
    "value": 97.00,
    "timestamp": "2025-11-28T10:35:00Z"
  }'
echo -e "\n"

echo "3. Criando evento via GET (payment)..."
curl "http://localhost:3000/api/events/add?type=payment&name=Maria%20Santos&email=maria.santos@example.com&value=199.90&timestamp=2025-11-29T14:20:00Z"
echo -e "\n"

echo "4. Criando evento via GET (upsell)..."
curl "http://localhost:3000/api/events/add?type=upsell&name=Pedro%20Costa&email=pedro.costa@example.com&value=47.50&timestamp=2025-11-30T09:15:00Z"
echo -e "\n"

echo "5. Criando mais eventos de payment..."
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "name": "Ana Paula",
    "email": "ana.paula@example.com",
    "value": 399.00,
    "timestamp": "2025-12-01T11:45:00Z"
  }'
echo -e "\n"

curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "name": "Carlos Eduardo",
    "email": "carlos.eduardo@example.com",
    "value": 249.90,
    "timestamp": "2025-12-01T15:20:00Z"
  }'
echo -e "\n"

echo "6. Criando eventos de upsell..."
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "upsell",
    "name": "Ana Paula",
    "email": "ana.paula@example.com",
    "value": 77.00,
    "timestamp": "2025-12-01T11:50:00Z"
  }'
echo -e "\n"

curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "upsell",
    "name": "Fernanda Lima",
    "email": "fernanda.lima@example.com",
    "value": 127.00,
    "timestamp": "2025-12-02T08:30:00Z"
  }'
echo -e "\n"

echo "7. Criando evento recente (hoje)..."
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "name": "Roberto Alves",
    "email": "roberto.alves@example.com",
    "value": 599.00
  }'
echo -e "\n"

echo ""
echo "Banco de dados populado com sucesso!"
echo "Acesse http://localhost:3000 para visualizar os eventos."
