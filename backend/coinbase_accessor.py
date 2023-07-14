import requests as re


def get_coinbase_data(curr_type: str):
    """Sends GET request to coinbase free API and returns the data of either FIAT or Crypto depending on type.

    Args:
        curr_type(str): Either 'fiat' or 'crypto'
    """
    if curr_type != "fiat" and curr_type != "crypto":
        raise ValueError("curr_type must be either 'fiat' or 'crypto'")
    url = "https://api.coinbase.com/v2/exchange-rates?currency="
    rates = {}
    if curr_type == "fiat":
        response = re.get(url + "USD")
        result = response.json()["data"]["rates"]
        rates["USD"] = {
            "BTC": result["BTC"],
            "ETH": result["ETH"],
            "DOGE": result["DOGE"],
        }
        response = re.get(url + "SGD")
        result = response.json()["data"]["rates"]
        rates["SGD"] = {
            "BTC": result["BTC"],
            "ETH": result["ETH"],
            "DOGE": result["DOGE"],
        }
        response = re.get(url + "EUR")
        result = response.json()["data"]["rates"]
        rates["EUR"] = {
            "BTC": result["BTC"],
            "ETH": result["ETH"],
            "DOGE": result["DOGE"],
        }
    elif curr_type == "crypto":
        response = re.get(url + "BTC")
        result = response.json()["data"]["rates"]
        rates["BTC"] = {
            "USD": result["USD"],
            "SGD": result["SGD"],
            "EUR": result["EUR"],
        }
        response = re.get(url + "ETH")
        result = response.json()["data"]["rates"]
        rates["ETH"] = {
            "USD": result["USD"],
            "SGD": result["SGD"],
            "EUR": result["EUR"],
        }
        response = re.get(url + "DOGE")
        result = response.json()["data"]["rates"]
        rates["DOGE"] = {
            "USD": result["USD"],
            "SGD": result["SGD"],
            "EUR": result["EUR"],
        }
    return rates
