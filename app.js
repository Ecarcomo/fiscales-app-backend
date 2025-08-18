// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan"); 
require("dotenv").config();

const authRoutes = require("./routes/auth");
const usuarioRoutes = require("./routes/usuarios");

const app = express();
app.use(cors(
  {origin: process.env.FRONTEND_URL || "http://localhost:3000", // Cambia esto por la URL de tu frontend
   credentials: true} // Permite enviar cookies y encabezados de autorización
));
app.use(express.json());
app.use(morgan("dev"));


// Rutas
app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});

const usuarioDB = process.env.usuarioDB;
const passwordDB = encodeURIComponent(process.env.passwordDB);
const cluster = process.env.cluster; // Cambiá por tu cluster real
const dbName = process.env.dbName;

const MONGO_URI = `mongodb+srv://${usuarioDB}:${passwordDB}@${cluster}/?retryWrites=true&w=majority&appName=${dbName}`;

console.log('MONGO_URI: ',MONGO_URI);

// Conexión DB y arranque
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(process.env.PORT, () => {
      console.log(`Servidor en http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error(err));
