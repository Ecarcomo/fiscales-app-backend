const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const { puedeCrear } = require("../middleware/roles");

exports.crearUsuario = async (req, res) => {

const {
    nombre,
    usuario,
    password,
    dni,
    email,
    rol,
    delegado_a_id,
    zona,
    mesa, 
    grupo_whatsapp,
    establecimiento,
    seccion_electoral,
    whatsapp,
    comentarios
  } = req.body;


  if (!puedeCrear(req.usuario.rol, rol)) {
    return res.status(403).json({ mensaje: "No puedes crear este tipo de usuario" });
  }
  // Validar que se proporcione delegado_por_id para roles que lo requieren
  if (rol !== "referente" && !delegado_a_id) {
    return res.status(400).json({ mensaje: "Este tipo de usuario requiere delegado" });
  }
  const existente = await Usuario.findOne({ usuario });
  if (existente) return res.status(400).json({ mensaje: "Usuario ya existe" });

  const passwordHash = await bcrypt.hash(password, 10);

  const nuevo = new Usuario({
    nombre,
    usuario,
    passwordHash,
    dni,
    email,
    rol,
    delegado_a_id: delegado_a_id || null,
    creado_por_id: req.usuario._id,
    zona,
    mesa, 
    grupo_whatsapp,
    establecimiento,
    seccion_electoral,
    whatsapp,
    comentarios
  });

  await nuevo.save();
  res.status(201).json({ mensaje: "Usuario creado con éxito" });
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, usuario, password, rol, zona, mesa, delegado_a_id, establecimiento, grupo_whatsapp, seccion_electoral, whatsapp} = req.body;

    // Verificar que el usuario existe
    const usuarioExistente = await Usuario.findById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Verificar permisos para actualizar
    if (!puedeCrear(req.usuario.rol, rol)) {
      return res.status(403).json({ mensaje: "No puedes actualizar a este tipo de usuario" });
    }


    // Verificar si el nuevo usuario ya existe (excluyendo el usuario actual)
    if (usuario && usuario !== usuarioExistente.usuario) {
      const usuarioDuplicado = await Usuario.findOne({ usuario });
      if (usuarioDuplicado) {
        return res.status(400).json({ mensaje: "El nombre de usuario ya existe" });
      }
    }

    // Preparar los datos de actualización
    const datosActualizacion = {
      nombre,
      usuario,
      rol,
      zona,
      mesa,
      establecimiento,
      grupo_whatsapp,
      seccion_electoral,
      whatsapp
    };

    // Manejar delegado_a_id correctamente
    if (rol === "referente") {
      // Para referente, NO incluir delegado_a_id en absoluto
      // No agregar nada al objeto datosActualizacion
    } else {
      // Para otros roles, incluir delegado_a_id solo si no está vacío
      if (delegado_a_id && delegado_a_id.trim() !== "") {
        datosActualizacion.delegado_a_id = delegado_a_id;
      } else {
        return res.status(400).json({ mensaje: "Este tipo de usuario requiere delegado" });
      }
    }

    // Si se proporciona una nueva contraseña, hashearla
    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      datosActualizacion.passwordHash = passwordHash;
    }

    // Actualizar el usuario
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      datosActualizacion,
      { new: true, runValidators: true }
    );

    res.json({ mensaje: "Usuario actualizado con éxito", usuario: usuarioActualizado });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.obtenerUsuariosDescendientes = async (req, res) => {
  const { delegado_a_id } = req.params;
  const usuarios = await Usuario.find({ delegado_a_id: delegado_a_id });
  res.json(usuarios);
};

exports.obtenerUsuariosDescendientesHermanos = async (req, res) => {
  try {
    const { delegado_a_id } = req.params;
    console.log(delegado_a_id);
    
    // Verificar que se proporcione el delegado_a_id
    if (!delegado_a_id) {
      return res.status(400).json({ mensaje: "delegado_a_id es requerido" });
    }

    // 1. Obtener usuarios que tengan el delegado_a_id especificado
    const usuariosDirectos = await Usuario.find({ delegado_a_id: delegado_a_id });
    
    // 2. Obtener los IDs de los usuarios directos
    const idsUsuariosDirectos = usuariosDirectos.map(usuario => usuario._id);
    
    // 3. Obtener usuarios que tengan como delegado_a_id los IDs de los usuarios directos
    const usuariosDescendientes = await Usuario.find({ 
      delegado_a_id: { $in: idsUsuariosDirectos } 
    });
    
    // 4. Combinar ambos resultados
    const todosLosUsuarios = [...usuariosDirectos, ...usuariosDescendientes];
    
    res.json(todosLosUsuarios);
  } catch (error) {
    console.error("Error al obtener usuarios descendientes hermanos:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};


exports.obtenerTodosLosUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({});
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los usuarios" });
  }
};

exports.obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el ID sea válido
    if (!id) {
      return res.status(400).json({ mensaje: "ID de usuario requerido" });
    }

    // Buscar el usuario por ID
    const usuario = await Usuario.findById(id);
    
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Devolver el usuario encontrado (sin la contraseña)
    const usuarioSinPassword = {
      _id: usuario._id,
      nombre: usuario.nombre,
      dni: usuario.dni,
      email: usuario.email,
      usuario: usuario.usuario,
      rol: usuario.rol,
      delegado_a_id: usuario.delegado_a_id,
      creado_por_id: usuario.creado_por_id,
      zona: usuario.zona,
      mesa: usuario.mesa,
      creado_en: usuario.creado_en,
      ultimo_acceso: usuario.ultimo_acceso,
      grupo_whatsapp: usuario.grupo_whatsapp,
      establecimiento: usuario.establecimiento,
      seccion_electoral: usuario.seccion_electoral,
      whatsapp: usuario.whatsapp,
      comentarios: usuario.comentarios
    };

    res.json(usuarioSinPassword);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
