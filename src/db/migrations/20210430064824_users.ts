import { Knex } from "knex";

exports.up = (knex: Knex) =>
  knex.schema.createTable("users", (table) => {
    table.bigIncrements("id").primary().notNullable;
    table.string("first_name");
    table.string("last_name");
    table.string("email").notNullable().unique();
    table.string("username").notNullable().unique();
    table.string("password_digest").notNullable();
    table.text("address");
    table.text("token");
    table.string("phone_number");
    table.integer("role");
    table.timestamps(true, true);
    table.index("email", "index_users_on_email");
    table.index(
      ["first_name", "last_name"],
      "index_users_on_first_name_last_name",
    );
  });

exports.down = (knex: Knex) => knex.schema.dropTable("users");
