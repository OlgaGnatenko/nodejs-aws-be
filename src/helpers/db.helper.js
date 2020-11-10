"use strict";

const { Client } = require("pg");

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

const connectToDB = async () => {
  try {
    const client = new Client(dbOptions);
    await client.connect();
    return client;
  } catch (err) {
    console.log(`Db connection error: ${err}`);
    return null;
  }
};

module.exports = {
  connectToDB,
};

module.exports.invoke = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const result = await client.query(`
            create table if not exists todo_list (
            id serial primary key,
            list_name text,
            list_description text 
        `);
  } catch (err) {
    console.error(`Error during database request execution: ${err}`);
  } finally {
    client.end();
  }
};
