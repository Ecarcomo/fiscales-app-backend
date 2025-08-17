const jerarquia = {
    referente: ["referente","fiscal_zona", "fiscal_general", "fiscal_mesa"],
    fiscal_zona: ["fiscal_zona","fiscal_general", "fiscal_mesa"],
    fiscal_general: ["fiscal_general","fiscal_mesa"],
    fiscal_mesa: ["fiscal_mesa"]
  };
  
  function puedeCrear(rolCreador, rolNuevo) {
    return jerarquia[rolCreador]?.includes(rolNuevo);
  }
  
  module.exports = { puedeCrear };
  