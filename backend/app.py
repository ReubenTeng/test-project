from fastapi import FastAPI
import coinbase_accessor as ca
import signal
import threading
import uvicorn

app = FastAPI()


@app.get("/")
async def root():
    return {"mesage": "Hello World"}


@app.get("/exchange-rates")
async def exchange_rates(base: str):
    try:
        connection = ca.connect_to_database()
        result = ca.get_coinbase_data(base, connection)
        connection.close()
        return result
    except ValueError:
        return {"message": "Invalid base value. Must be either 'fiat' or 'crypto'"}


@app.get("/historical-rates")
async def get_historical_rates(
    base_currency: str, target_currency: str, start: int, end: int = -1
):
    try:
        connection = ca.connect_to_database()
        result = ca.get_historical_rates(
            base_currency, target_currency, start, end, connection=connection
        )
        connection.close()
        return result
    except ValueError:
        return {"message": "Unable to find data for the given currency pair"}


def update_database():
    ca.update_all()
    threading.Timer(30.0, ca.update_all).start()


# ca.create_table()
update_database()
