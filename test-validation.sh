#!/bin/bash

echo "=== Testando Validações da API ==="
echo ""

echo "TEST 1: Type inválido (deve retornar erro 400)"
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "invalid_type",
    "name": "Test User",
    "email": "test@example.com",
    "value": 100.00
  }'
echo -e "\n\n"

echo "TEST 2: Email inválido (deve retornar erro 400)"
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "name": "Test User",
    "email": "not-an-email",
    "value": 100.00
  }'
echo -e "\n\n"

echo "TEST 3: Value negativo (deve retornar erro 400)"
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "name": "Test User",
    "email": "test@example.com",
    "value": -50.00
  }'
echo -e "\n\n"

echo "TEST 4: Name vazio (deve retornar erro 400)"
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "name": "",
    "email": "test@example.com",
    "value": 100.00
  }'
echo -e "\n\n"

echo "TEST 5: Timestamp formato inválido (deve retornar erro 400)"
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "name": "Test User",
    "email": "test@example.com",
    "value": 100.00,
    "timestamp": "2025-13-45"
  }'
echo -e "\n\n"

echo "TEST 6: GET /api/events/add com type inválido (deve retornar erro 400)"
curl "http://localhost:3000/api/events/add?type=sale&name=Test&email=test@example.com&value=100"
echo -e "\n\n"

echo "TEST 7: GET /api/events com date_from inválido (deve retornar erro 400)"
curl "http://localhost:3000/api/events?date_from=2025/12/01&date_to=2025-12-02"
echo -e "\n\n"

echo "TEST 8: Dados válidos (deve retornar 201)"
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "name": "Valid User",
    "email": "valid@example.com",
    "value": 150.00,
    "timestamp": "2025-12-01T10:00:00Z"
  }'
echo -e "\n\n"

echo "TEST 9: GET /api/events válido (deve retornar 200)"
curl "http://localhost:3000/api/events?date_from=2025-11-25&date_to=2025-12-02"
echo -e "\n\n"

echo "=== Testes Concluídos ==="
