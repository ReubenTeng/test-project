FROM python:3.11.4-slim
RUN apt-get update && apt-get install
RUN python -m pip install --upgrade pip
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
# Do change the username, password, database name, etc as necessary in the coinbase_accessor.py file before building the image
COPY . .
CMD ["uvicorn", "app:app", "--reload", "--host=0.0.0.0", "--port=80"]
EXPOSE 80