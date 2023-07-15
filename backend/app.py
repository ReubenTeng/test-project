from fastapi import FastAPI
import coinbase_accessor as ca
import threading

# API for the backend created using FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"mesage": "Hello World"}


@app.get("/exchange-rates")
async def exchange_rates(base: str):
    """Gets exchange rates for the given base currency type

    Args:
        base (str): Either "fiat" or "crypto", where "fiat" is USD, EUR, and SGD and "crypto" is BTC, ETH, and DOGE

    Returns:
        dict: A dictionary containing the exchange rates for the given base currency type
    """
    try:
        connection = ca.connect_to_database()
        result = ca.get_coinbase_data(base)
        connection.close()
        return result
    except ValueError:
        return {"message": "Invalid base value. Must be either 'fiat' or 'crypto'"}


@app.get("/historical-rates")
async def get_historical_rates(
    base_currency: str, target_currency: str, start: int, end: int = -1
):
    """Gets historical rates for the given currency pair

    Args:
        base_currency (str): Base currency type
        target_currency (str): Target currency type
        start (int): Start time in Unix time
        end (int, optional): End time in Unix time. If not given, will default to current time.

    Returns:
        dict: A dictionary containing the historical rates for the given currency pair
    """
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
    th = threading.Timer(120.0, update_database)
    th.daemon = True
    th.start()


# This is called when the server starts
update_database()
