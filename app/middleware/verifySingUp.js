const { users: User } = require("./../models/index.js");

// Crear una función que verifique si el email ya está registrado
const verifySingUp = async (req, res, next) => {
  try {
    // Obtener el email del cuerpo de la petición
    const { email } = req.body;
    // Buscar el usuario con ese email en la base de datos
    const user = await User.findOne({ where: { email } });
    // Si existe el usuario, enviar un mensaje de error
    if (user) {
      return res.status(400).json({
        error: "Correo electrónico actualmente registrado en la base de datos",
      });
    }
    // Continuar con el siguiente middleware si no existe el usuario
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || error });
  }
};

module.exports = { verifySingUp };
