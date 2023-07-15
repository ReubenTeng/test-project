# Coinbase exchange rates
## Running the server
The backend was written in Python 3.11.4.
Database used is PostgreSQL.

Ensure that the variables 
```
NAME
USER
PASSWORD
HOST
PORT
```
in the coinbase_accessor.py file have been replaced with your psql details.

### Using Docker
After providing your psql login details, build an image from the given Dockerfile. Run the image with the command `docker run -p {PORT}:80`, where PORT is an available port. After that, you can access the API at `http://localhost:{PORT}`.

### Running the server manually
Install the requirements by using the command `pip -r requirements.txt`. Use the command `uvicorn app:app` to run the server (default on port 8000, although this can be specified by adding the argument `--port={PORT}` to the command).

### Further information
After the server is running, you can view the documentation at `http://localhost:{PORT}/docs`