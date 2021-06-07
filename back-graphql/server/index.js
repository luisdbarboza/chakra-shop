require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");

const app = express();

app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
app.use(express.urlencoded({ extended: false }));

app.use(require("./routes/index"));

//conexion a la base de datos
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch(() => {
    console.log("Ocurrio un error al conectarse a la base de datos");
  });

app.listen(process.env.PORT, () => {
  console.log("Servidor escuchando en el puerto " + process.env.PORT);
});
