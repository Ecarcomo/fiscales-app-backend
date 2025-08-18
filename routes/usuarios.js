const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { crearUsuario, obtenerTodosLosUsuarios,obtenerUsuariosDescendientes,obtenerUsuariosDescendientesHermanos, actualizarUsuario,obtenerUsuario } = require("../controllers/usuariosController");

router.post("/", auth, crearUsuario);
router.get("/delegados", auth, obtenerUsuariosDescendientes);
router.get("/",  obtenerTodosLosUsuarios);

router.get("/delegados/:delegado_a_id", auth, obtenerUsuariosDescendientesHermanos);
router.get("/:id", auth, obtenerUsuario);
router.put("/:id", auth, actualizarUsuario);

module.exports = router;
