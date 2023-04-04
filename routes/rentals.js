var express = require("express");
var router = express.Router();
const { Pool } = require("pg");
const JSONAPISerializer = require("jsonapi-serializer").Serializer;
const { Serializer } = require("jsonapi-serializer");

const config = {
  user: "postgres",
  //host: 'db',
  host: "localhost",
  database: "databasenode",
  password: "mysecretpassword",
  port: 5432,
  ssl: false,
};

const pool = new Pool(config);

const getRentals = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rental");

    // Serializamos los datos a JSONAPI
    const serializer = new JSONAPISerializer("rentals", {
      attributes: [
        "title",
        "owner",
        "city",
        "category",
        "bedrooms",
        "image",
        "description",
      ],
    });
    const jsonapiData = serializer.serialize(result.rows);

    // Enviamos la respuesta como JSONAPI
    res.setHeader("Content-Type", "application/vnd.api+json");
    res.status(200).send(jsonapiData);
  } catch (err) {
    console.error("Error al obtener los alquileres", err);
    res.status(500).send("Error al obtener los alquileres");
  }
};

const getRentalById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM rental WHERE rental.id = '${req.params.id}'`
    );
    // Serializamos los datos a JSONAPI
    const serializer = new JSONAPISerializer("rental", {
      attributes: [
        "title",
        "owner",
        "city",
        "category",
        "bedrooms",
        "image",
        "description",
      ],
    });
    const rental = result.rows[0];
    if (!rental) {
      return res.status(404).send("No se encontró ningún alquiler con ese ID");
    }

    const jsonapiData = serializer.serialize(rental);
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(jsonapiData);
  } catch (err) {
    console.error("Error al obtener los alquileres", err);
    res.status(500).send("Error al obtener los alquileres");
  }
};

const postRental = async (req, res) => {
  if (req.body != null) {
    const { data } = req.body;
    console.log(req.body);
    const {
      attributes: {
        title,
        owner,
        city,
        category,
        bedrooms,
        image,
        description,
      },
    } = data[0];
    const attributes = data[0].attributes;

    try {
      await pool.connect();
      const response = await pool.query(`
      INSERT INTO rental (title, owner, city, category, bedrooms, image, description) 
      VALUES ( '${title}', '${owner}', '${city}', '${category}', ${bedrooms}, '${image}', '${description}')
      RETURNING *;
    `);
      const JSONAPISerializer = require("jsonapi-serializer").Serializer;
      const serializer = new JSONAPISerializer("rental", {
        attributes: [
          "title",
          "owner",
          "city",
          "category",
          "bedrooms",
          "image",
          "description",
        ],
      });

      const jsonapiData = serializer.serialize({
        id: response.rows[0].id,
        ...attributes,
      });
      console.log(jsonapiData);
      // Enviamos la respuesta como JSONAPI
      res.setHeader("Content-Type", "application/vnd.api+json");
      res.status(200).send({ data: jsonapiData });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error creating rental");
    }
  }
};

const updateRental = async (req, res) => {
  if (req.body != null) {
    const { data } = req.body;
    console.log(data[0]);
    const {
      attributes: {
        title,
        owner,
        city,
        category,
        bedrooms,
        image,
        description,
      },
    } = data[0];
    const attributes = data[0].attributes;

    try {
      await pool.connect();
      const response = await pool.query(`UPDATE rental SET
    title='${title}', owner='${owner}', city='${city}', category='${category}', bedrooms=${bedrooms}, image='${image}', description='${description}'
      WHERE rental.id = '${req.params.id}'`);
      const JSONAPISerializer = require("jsonapi-serializer").Serializer;
      const serializer = new JSONAPISerializer("rental", {
        attributes: [
          "title",
          "owner",
          "city",
          "category",
          "bedrooms",
          "image",
          "description",
        ],
      });

      const jsonapiData = serializer.serialize({
        id: data[0].id,
        ...attributes,
      });
      console.log(jsonapiData);
      // Enviamos la respuesta como JSONAPI
      res.setHeader("Content-Type", "application/vnd.api+json");
      res.status(200).send({ data: jsonapiData });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error creating rental");
    }
  }
};
const deleteRental = async (req, res) => {
  try {
    await pool.connect();
    const response = await pool.query(
      `DELETE FROM rental WHERE rental.id = '${req.params.id}'`
    );
    console.log(response);
    res.send(`Rental with id ${req.params.id} was deleted.`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting rental");
  }
};

router.get("/", getRentals);
router.get("/:id", getRentalById);
router.post("/", postRental);
router.delete("/:id", deleteRental);
router.patch("/:id", updateRental);

module.exports = router;

process.on("exit", () => {
  pool.end();
});
