const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const express = require("express");
const cors = require('cors');
const app = express();
require('dotenv').config();


// conexión con mysql y relaciones
const sequelize = require("./database/db.js");
require("./database/associations.js")

app.use(cors({origin: '*'})); //OJo cambiar en producción!!
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const apiroutes = require("./routes/apiRouter.js");
app.use("/digiagro", apiroutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);

  sequelize
  .sync({force: false})// Cambiar a true si quiero mantener los datos entre reinicios
  .then(() => console.log('Conectado a digiagro')) 
});
