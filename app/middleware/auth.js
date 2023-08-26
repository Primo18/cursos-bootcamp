const { verify } = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../config/auth.config.js");
const { users: User } = require("./../models/index.js");

// Crear una función que verifique el token de autenticación
const verifyToken = async (req, res, next) => {
  try {
    // Obtener el token de los headers de la petición
    const token = req.headers.authorization;
    // Verificar el token usando la clave privada
    verify(token, PRIVATE_KEY, async (err, decoded) => {
      // Si hay un error, enviar un mensaje de error
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      // Obtener el id y el email del token decodificado
      const { id, email } = decoded;
      // Buscar el usuario con ese id y email en la base de datos
      const user = await User.findOne({
        where: { id, email },
        raw: true,
        attributes: ["id", "email"],
      });
      // Si no se encuentra el usuario, enviar un mensaje de error
      if (!user) {
        return res.status(400).json({ error: "Token inválido" });
      }
      // Añadir el usuario al objeto req para que pueda ser usado por otros middlewares
      req._user = user;
      // Continuar con el siguiente middleware
      next();
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || error });
  }
};

module.exports = { verifyToken };
