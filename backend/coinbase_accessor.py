import requests as re
import psycopg2 as pg
import time

NAME: str = "TABLE NAME"
USER: str = "USERNAME"
PASSWORD: str = "PASSWORD"
# HOST: str = "host.docker.internal" # USE THIS FOR DOCKER
HOST: str = "HOST"  # USE THIS FOR LOCAL
PORT: str = "PORT"

FIAT = ["USD", "SGD", "EUR"]
CRYPTO = ["BTC", "ETH", "DOGE"]


def get_coinbase_data(curr_type: str, connection=None):
    """Sends GET request to coinbase free API and returns the data of either FIAT or Crypto depending on type.

    Args:
        curr_type(str): Either 'fiat' or 'crypto'
    """
    if curr_type != "fiat" and curr_type != "crypto":
        raise ValueError("curr_type must be either 'fiat' or 'crypto'")

    rates = {}
    if curr_type == "fiat":
        for curr in FIAT:
            rates[curr] = get_curr(curr, "fiat", connection)
    elif curr_type == "crypto":
        for curr in CRYPTO:
            rates[curr] = get_curr(curr, "crypto", connection)
    return rates


def get_curr(curr: str, base: str, connection=None):
    """Gets the most recent conversion rates for a given currency.

    Args:
        curr (str): currency to convert from
        base (str): base (either fiat or crypto) of the given currency
        connection (optional): If given, uses psql server. Else, takes from coinbase API. Defaults to None.

    Raises:
        ValueError: If base is not either 'fiat' or 'crypto'

    Returns:
        dict: A dictionary containing the conversion rates for the given currency base type
    """
    if base != "fiat" and base != "crypto":
        raise ValueError("curr_type must be either 'fiat' or 'crypto'")
    if connection is None:
        url = "https://api.coinbase.com/v2/exchange-rates?currency="
        response = re.get(url + curr)
        result = response.json()["data"]["rates"]
        if base == "fiat":
            return {"BTC": result["BTC"], "ETH": result["ETH"], "DOGE": result["DOGE"]}
        elif base == "crypto":
            return {"USD": result["USD"], "SGD": result["SGD"], "EUR": result["EUR"]}
    else:
        rates = {}
        cursor = connection.cursor()
        if base == "fiat":
            for curr_to in CRYPTO:
                # get the most recent rate
                cursor.execute(
                    f"SELECT rate FROM conversion WHERE from_curr = '{curr}' AND to_curr = '{curr_to}' ORDER BY timestamp DESC LIMIT 1;"
                )
                rates[curr_to] = cursor.fetchone()[0]
        elif base == "crypto":
            for curr_to in FIAT:
                cursor.execute(
                    f"SELECT rate FROM conversion WHERE from_curr = '{curr}' AND to_curr = '{curr_to}' ORDER BY timestamp DESC LIMIT 1;"
                )
                rates[curr_to] = cursor.fetchone()[0]
        cursor.close()
        return rates


def connect_to_database():
    """Connects to currency conversion database

    Returns:
        Connection to the database
    """
    # DB schema:
    # the primary key is (from_curr, to_curr, timestamp)
    # from_curr: the currency to convert from
    # to_curr: the currency to convert to
    # rate: the conversion rate from from_curr to to_curr
    # timestamp: the time the rate was last updated

    connection = pg.connect(
        database=NAME, user=USER, password=PASSWORD, host=HOST, port=PORT
    )

    return connection


def get_historical_rates(
    base_curr: str,
    to_curr: str,
    start_time: int,
    end_time: int = -1,
    connection=None,
):
    """Gets the historical rates for a given currency pair.

    Args:
        base_curr (str): Base currency
        to_curr (str): Currency to convert to
        start_time (int): Start time of the query
        end_time (_type_, optional): End time of the query. Defaults to current time.
        connection (_type_): Connection to the database
    """
    to_close = False
    if connection is None:
        to_close = True
        connection = connect_to_database()
    cursor = connection.cursor()
    command = (
        f"SELECT rate, timestamp FROM conversion WHERE from_curr = '{base_curr}' AND to_curr = '{to_curr}' AND timestamp >= {start_time} AND timestamp <= {end_time} ORDER BY timestamp ASC;"
        if end_time != -1
        else f"SELECT rate, timestamp FROM conversion WHERE from_curr = '{base_curr}' AND to_curr = '{to_curr}' AND timestamp >= {start_time} ORDER BY timestamp ASC;"
    )
    cursor.execute(command)
    response = cursor.fetchall()
    result = {}
    result["result"] = []
    for row in response:
        result["result"].append({"value": row[0], "timestamp": row[1]})
    cursor.close()
    if to_close:
        connection.close()
    return result


def update_all(connection=None):
    """Updates all values in the database.

    Args:
        connection: connection to the database
    """
    to_close = False
    if connection is None:
        to_close = True
        connection = connect_to_database()

    cursor = connection.cursor()
    cursor.execute(
        "CREATE TABLE IF NOT EXISTS conversion (from_curr TEXT, to_curr TEXT, rate TEXT, timestamp INTEGER, PRIMARY KEY (from_curr, to_curr, timestamp));"
    )
    rates = get_coinbase_data("fiat")
    timestamp = int(time.time())
    for curr in rates:
        for curr_to in rates[curr]:
            cursor.execute(
                f"INSERT INTO conversion (from_curr, to_curr, rate, timestamp) VALUES ('{curr}', '{curr_to}', {rates[curr][curr_to]}, {timestamp}) ON CONFLICT (from_curr, to_curr, timestamp) DO UPDATE SET rate = {rates[curr][curr_to]};"
            )
            print("updated " + curr + " -> " + curr_to + " to " + rates[curr][curr_to])
    rates = get_coinbase_data("crypto")
    for curr in rates:
        for curr_to in rates[curr]:
            cursor.execute(
                f"INSERT INTO conversion (from_curr, to_curr, rate, timestamp) VALUES ('{curr}', '{curr_to}', {rates[curr][curr_to]}, {timestamp}) ON CONFLICT (from_curr, to_curr, timestamp) DO UPDATE SET rate = {rates[curr][curr_to]};"
            )
            print("updated " + curr + " -> " + curr_to + " to " + rates[curr][curr_to])
    connection.commit()
    cursor.close()
    if to_close:
        connection.close()
