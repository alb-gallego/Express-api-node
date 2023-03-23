const { Pool, Client } = require('pg');

const pool = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'databasenode',
  password: 'mysecretpassword',
  port: 5432,
});

pool.connect();

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res.rows);
    }
  });

  pool.query(
    `SELECT * FROM prueba;`,
    (err, res) => {
      if (err) {
        console.error('Error al crear la tabla', err);
      } else {
        console.log(res.rows);
      }
      pool.end();
    }
  );
  
  