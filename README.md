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

### Migrations

To run the migrations:

```bash
npm run db:migrate:up # Up oe migration at a time
npm run db:migrate:up_all # Up all migrations
npm run db:migrate:down # Down one migration at a time
npm run db:migrate:down_all # Down all migrations
```

To create migrations, install `db-migrate` package globally by running:

```bash
npm i -g db-migrate
```

Then to create a migration along with its SQL files run:

```bash
db-migrate create **table_name** --sql-file
```

To run the migrations on defaultEnv set in `database.json` run the following command:

```bash
npm run db:migrate:up
```

- The above will create the migrations on the default databse set in the database.json file.
- To run the migrations on different environment either change the `defauleEnv` value in `database.json` to target environment or copy the command description for `db:migrate:up` in `package.json` and then pass `-e test` option to the command

  For example to create migrations on test environment you can run:

  ```
  node ./node_modules/db-migrate/bin/db-migrate up -c 1 -m ./src/db/migrations -e test
  ```

<!-- TODO:
  - Create Migrations and tables for models
  - Create database tests for CRUD operations associated with models
  - Add validations for models
  - Add JWT authentication for models
-->
