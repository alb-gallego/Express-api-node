var express = require('express');
var router = express.Router();
const { Pool, Client } = require('pg');


const config = {
  user: 'postgres',
  //host: 'db',  
  host:'localhost',
  database: 'databasenode',
  password: 'mysecretpassword',
  port:5432,
  ssl: false,
};

const pool = new Pool(config);

pool.connect();

pool.query('DROP TABLE IF EXISTS rental;');
pool.query(`

CREATE TABLE IF NOT EXISTS rental (
 id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(255),
  owner VARCHAR(255),
  city VARCHAR(255),
  category VARCHAR(255),
  bedrooms INT,
  image VARCHAR(255),
  description VARCHAR(255)
);`);

process.on('exit', () => {
    pool.end();
  });