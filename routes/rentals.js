var express = require('express');
var router = express.Router();
const { Pool, Client } = require('pg');

const config = {
  user: 'postgres',
  host: 'localhost',  
  database: 'databasenode',
  password: 'mysecretpassword',
  port:5432,
  ssl: false,
};

const pool = new Client(config);

const peticion =async (req,res)=>{

  /* `INSERT INTO rental (id,title,owner,city ,lat ,lng ,category,
        bedrooms,image,description)
        VALUES ('grand-old-mansion','Grand Old Mansion','Veruca Salt','San Francisco',
        37.7749,-122.4194,'Estate',15,'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
        'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.'
        );`,*/
   await     pool.connect();

  await pool.query(`SELECT * FROM rental`
,
    (err, res) => {
      if (err) {
        console.error('Error al crear la tabla', err);
      } else {
        console.log(res.rows);
      }
      pool.end();
    }
    
  );

  res.send('OK');

};


router.get('/', peticion);

module.exports = router


