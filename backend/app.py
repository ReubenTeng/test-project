from fastapi import FastAPI
from coinbase_accessor import get_coinbase_data

app = FastAPI()


@app.get("/")
async def root():
    return {"mesage": "Hello World"}


@app.get("/exchange-rates")
async def exchange_rates(base: str):
    try:
        return get_coinbase_data(base)
    except ValueError:
        return {"message": "Invalid base value. Must be either 'fiat' or 'crypto'"}
