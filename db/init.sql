CREATE TABLE IF NOT EXISTS rental (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(255),
  owner VARCHAR(255),
  city VARCHAR(255),
  category VARCHAR(255),
  bedrooms INT,
  image VARCHAR(255),
  description VARCHAR(255)
);

INSERT INTO rental ( title,owner,city,category,bedrooms,image,description) VALUES 
('Prueba','Alberto','Sevilla','Community',5,'','descripcion'); 

