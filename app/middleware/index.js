const { verifyToken } = require("./auth.js");
const { verifySingUp } = require("./verifySingUp.js");

// Crear una función que verifique la identidad del usuario logueado con el usuario solicitado
const verifyIdentity = (req, res, next) => {
  // Obtener el id del usuario solicitado de los parámetros de la ruta
  const { id } = req.params;
  // Obtener el id del usuario logueado del objeto _user que se añade al verificar el token
  const { id: loggedId } = req._user;
  // Comparar los ids y enviar un error si no coinciden
  if (id != loggedId) {
    return res.status(400).json({
      error: `No tienes permisos para realizar esta acción`,
    });
  }
  // Continuar con el siguiente middleware si los ids coinciden
  next();
};

// Exportar las funciones como un objeto
module.exports = { verifySingUp, verifyToken, verifyIdentity };
