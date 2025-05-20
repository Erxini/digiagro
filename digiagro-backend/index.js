const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const express = require("express");
const cors = require('cors');
const path = require('path');
const app = express();
require('dotenv').config();


// conexión con mysql y relaciones
const sequelize = require("./database/db.js");
require("./database/associations.js")

app.use(cors({origin: '*'})); //OJo cambiar en producción!!
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Configurar la carpeta uploads para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const apiroutes = require("./routes/apiRouter.js");
app.use("/digiagro", apiroutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);

  sequelize
  .sync({force: false}) //true para recrear las tablas con los nuevos campos
  .then(() => {
    console.log('Base de datos sincronizada - tablas recreadas');
  })
});
