var express = require("express");
var router = express.Router();
const { Pool } = require("pg");
const JSONAPISerializer = require("jsonapi-serializer").Serializer;

const config = {
  user: "postgres",
  //CONFIG FOR LOCAL MACHINE
  // host: "localhost",
  // database: "databasenode",
  //CONFIG FOR DOCKER COMPOSE
  host: "db",
  database: 'postgres',
  password: "mysecretpassword",
  port: 5432,
  ssl: false,
};

const pool = new Pool(config);
// //Init sql script to create table
// const fs = require('fs');
// const sql = fs.readFileSync('./db/init.sql').toString();
// pool.query(sql);

//CRUD METHODS
const getRentals = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rental");

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

function checkAttributes(attributes, key, errors) {
  if (attributes?.[key]?.length < 5 && key !== "category" && key !== "bedrooms") {
    errors.push(`${key} length must be greater than 5`);
  } else if (key === "bedrooms" && attributes[key] <= 0) {
    errors.push(`${key}  must be greater than 0`);
  } else if (
    key === "category" &&
    (attributes["category"] !== "Community" &&
      attributes["category"] !== "Standalone")
  ) {
    errors.push(`${key}  must be Community or Standalone`);
  }
}

const postRental = async (req, res) => {
  if (req.body != null) {
    const { data } = req.body;
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
    errors = [];
    for (let key in attributes) {
      checkAttributes(attributes, key, errors);
    }

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    try {
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
      //console.log(jsonapiData);
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
    errors = [];
    for (let key in attributes) {
      checkAttributes(attributes, key, errors);
    }

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    try {
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
    const response = await pool.query(
      `DELETE FROM rental WHERE rental.id = '${req.params.id}'`
    );
    console.log(response);
    //res.send(`Rental with id ${req.params.id} was deleted.`);
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
