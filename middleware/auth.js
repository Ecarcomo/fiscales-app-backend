const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

module.exports = async function (req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ mensaje: "Token requerido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = await Usuario.findById(decoded._id);
    if (!req.usuario) return res.status(401).json({ mensaje: "Usuario inválido" });
    next();
  } catch {
    res.status(401).json({ mensaje: "Token inválido" });
  }
};
