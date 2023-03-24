const { Pool } = require('pg');
var express = require('express');
var router = express.Router();


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'databasenode',
  password: 'mysecretpassword',
  port: 5432,
});

pool.connect();


/* GET users listing. */
router.get('/rentals', function(req, res, next) {
  pool.query(
    `SELECT * FROM rental;`,
    (err, res) => {
      if (err) {
        console.error('Error al obtener los rentals', err);
      } else {
        console.log(res.rows);
        res.send('respond with a resource');

      }
      pool.end();
    }
  );
});

module.exports = router;
  