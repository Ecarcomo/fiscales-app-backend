const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  dni: { type: String, required: false, unique: true },
  email: { type: String, required: false, unique: true },
  usuario: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  rol: {
    type: String,
    enum: ["referente", "fiscal_zona", "fiscal_general", "fiscal_mesa"],
    required: true
  },
  delegado_a_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Usuario",
    required: function() {
      return this.rol !== "referente";
    }
  },
  creado_por_id: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  zona: String,
  mesa: String,
  creado_en: { type: Date, default: Date.now },
  ultimo_acceso: Date,
  grupo_whatsapp: String,
  establecimiento: String,
  seccion_electoral: String,
  whatsapp: String,
  comentarios: String
});

module.exports = mongoose.model("Usuario", usuarioSchema);
