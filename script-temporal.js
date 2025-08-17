// script-temporal.js
// Crear un usuario inicial manualmente (referente)

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Usuario = require("./models/Usuario");
require("dotenv").config();

const usuarioDB = process.env.usuarioDB;
const passwordDB = encodeURIComponent(process.env.passwordDB);
const cluster = process.env.cluster; // Cambiá por tu cluster real
const dbName = process.env.dbName;

const MONGO_URI = `mongodb+srv://${usuarioDB}:${passwordDB}@${cluster}/${dbName}?retryWrites=true&w=majority`;



mongoose.connect(MONGO_URI).then(async () => {
  const hash = await bcrypt.hash("clave123", 10);
  await Usuario.create({
    nombre: "Super Referente",
    usuario: "referente",
    passwordHash: hash,
    rol: "referente"
  });
  console.log("Usuario creado");
  mongoose.disconnect();
});
