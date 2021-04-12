# CookMe NodeJS API

## Scripts

1. `watch`: watch for changes
2. `dev`: run dev mode
3. `lint`, `lint:fix`: linting
4. `format`: prettify
5. `test`: run all tests
6. `start`: run prod mode

## Database Setups

```bash
createdb -U postgres cookme_dev
createdb -U postgres cookme_test
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
