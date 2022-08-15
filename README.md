# API - Currency Exchange

## Endpoints:

- GET (/exchange/?from=USD&to=BRL&amount=5/) 
- GET (/currencies/USD/) 
- POST (/currencies/)
  - { currency: 'USD', value: 1 } 
- PATCH (/currencies/BRL/value)
  - { value: 0.2 }
- DELETE (//currencies/EUR/) 