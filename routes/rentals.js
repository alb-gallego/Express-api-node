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


  /* `INSERT INTO rental (id,title,owner,city ,lat ,lng ,category,
        bedrooms,image,description)
        VALUES ('grand-old-mansion','Grand Old Mansion','Veruca Salt','San Francisco',
        37.7749,-122.4194,'Estate',15,'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
        'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.'
        );`,*/


const getRentals = async (req, res) => {
  try {
    await pool.connect();

    const result = await pool.query('SELECT * FROM rental');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al crear la tabla', err);
    res.status(500).send('Error al crear la tabla');
  } finally {
    
    //pool.end();
  }
};

const postRental = async (req, res) => {
  const { id, title, owner, city, category, bedrooms, image, description } = req.body;
  console.log(req.body);
  try {
    await pool.connect();

    const response = await pool.query(`
      INSERT INTO rental (id, title, owner, city, category, bedrooms, image, description) 
      VALUES ('${id}', '${title}', '${owner}', '${city}', '${category}', ${bedrooms}, '${image}', '${description}')
    `);
    console.log(response);
    res.send('Rental created');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating rental');
  }
};

const getRentalById = async(req,res)=>{
    console.log(req.params.id);
    
    try {
      await pool.connect();

      const response = await pool.query(`SELECT * FROM rental WHERE rental.id = '${req.params.id}'`);
      console.log(response.rows);
      res.send(response.rows);
    } catch (err) {
      console.error(err);
    res.status(404).send('Error finding rental');
    }

}

const deleteRental = async(req,res)=>{
  try{
    await pool.connect();
    const response = await pool.query(`DELETE FROM rental WHERE rental.id = '${req.params.id}'`);    
    console.log(response);
    res.send(`Rental with id ${req.params.id} was deleted.`);
  }catch(err){
    console.error(err);
    res.status(500).send('Error deleting rental');
  }
}

const updateRental = async(req,res)=>{
  
  const {  title, owner, city, category, bedrooms, image, description } = req.body;
  try{
    await pool.connect();
    const response = await pool.query(`UPDATE rental SET
    title='${title}', owner='${owner}', city='${city}', category='${category}', bedrooms=${bedrooms}, image='${image}', description='${description}'
      WHERE rental.id = '${req.params.id}'`);    
    console.log(response);
    res.send('Rental updated');
    
  }catch(err){
    console.error(err);
    res.status(500).send('Error updating rental');
  }
}


router.get('/', getRentals);
router.get('/:id',getRentalById);
router.post('/',postRental);
router.delete('/:id',deleteRental);
router.put('/:id',updateRental);



module.exports = router;

process.on('exit', () => {
  pool.end();
});


