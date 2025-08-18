const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { usuario, password } = req.body;
  console.log("Login attempt for user:", usuario);
  const user = await Usuario.findOne({ usuario });
  console.log("User fetched from DB:", user ? user.usuario : "not found");
  if (!user) return res.status(400).json({ mensaje: "Usuario no encontrado" });
 
  const valido = await bcrypt.compare(password, user.passwordHash);
  if (!valido) return res.status(400).json({ mensaje: "Contraseña incorrecta" });

  const token = jwt.sign({ _id: user._id,
                          nombre: user.nombre,
                          usuario: user.usuario,
                          rol: user.rol,
                          delegado_a_id: user.delegado_a_id
                          },
     process.env.JWT_SECRET, { expiresIn: "1h" });
  user.ultimo_acceso = new Date();
  await user.save();
                         
  res.json({ token, usuario: user.usuario, rol: user.rol });
};

exports.logout = async (req, res) => {
  // Aquí podrías agregar lógica para blacklist si lo deseas
  res.json({ mensaje: "Logout exitoso" });
};