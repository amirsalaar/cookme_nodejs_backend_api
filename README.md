# CookMe NodeJS API

## Scripts

1. `watch`: watch for changes
2. `dev`: run dev mode
3. `lint`, `lint:fix`: linting
4. `format`: prettify
5. `test`: run all tests
6. `start`: run prod mode

## Database Setups

In version 2, we have switched the databse to MongoDB and have utilized containerization around our database instance. The MongoDB server is running on a Docker container so as to give the corss-platform flexibility to run the app. For that purpose, `docker-compose.yml` file cintains the information of the container running our MongoDB server.

### Steps for running and stopping the database container

- To start the database container:

```bash
docker-compose up -d
```

- To stop the database container:

```bash
docker-compose down
```

### Main app container

TODO:

- To make the node server and mongodb server run together, docker-compose needs to be adjusted.
