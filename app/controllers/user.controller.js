const { users: User } = require("../models");
const { sign } = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../config/auth.config.js");
const Password = require("./../utils/Password.js");

// Crear una función que cree un usuario
exports.createUser = async (req, res) => {
  // Obtener los datos del cuerpo de la petición
  const { firstName, lastName, email, password: passFromBody } = req.body;
  try {
    // Generar el hash de la contraseña usando el módulo Password
    const hash = Password.toHash(passFromBody);
    // Crear el usuario en la base de datos
    const user = await User.create({ firstName, lastName, email, password: hash });
    // Enviar el usuario como respuesta
    return res.json(user);
  } catch (error) {
    // Si ocurre un error, enviar un mensaje de error
    console.error(`Error al crear el usuario: ${error}`);
    return res.status(400).json({ error: error.message || error });
  }
};

// Crear una función que busque un usuario por su id
exports.findUserById = async (req, res) => {
  // Obtener el id del usuario de los parámetros de la ruta
  const { id } = req.params;
  try {
    // Buscar el usuario por su id en la base de datos usando el scope includeBootcamps para incluir los bootcamps en los que está registrado
    const user = await User.scope("includeBootcamps").findByPk(id);

    // Si no se encuentra el usuario, enviar un mensaje de error
    if (!user) {
      return res.status(404).json({ error: `Usuario(${id}) no encontrado` });
    }

    // Enviar el usuario como respuesta
    return res.json(user);
  } catch (error) {
    // Si ocurre un error, enviar un mensaje de error
    console.error(`Error al encontrar los usuarios: ${error}`);
    return res.status(400).json({ error: error.message || error });
  }
};

// Crear una función que busque todos los usuarios
exports.findAll = async (_, res) => {
  try {
    // Buscar todos los usuarios en la base de datos usando el scope includeBootcamps para incluir los bootcamps en los que están registrados
    const users = await User.scope("includeBootcamps").findAll();
    // Enviar los usuarios como respuesta
    return res.json(users);
  } catch (error) {
    // Si ocurre un error, enviar un mensaje de error
    console.error(error);
    return res.status(400).json({ error: error.message || error });
  }
};

// Crear una función que actualice un usuario por su id
exports.updateUserById = async (req, res) => {
  // Obtener el id del usuario de los parámetros de la ruta
  const { id } = req.params;
  try {
    // Buscar el usuario por su id en la base de datos
    const user = await User.findByPk(id);

    // Si no se encuentra el usuario, enviar un mensaje de error
    if (!user) {
      return res.status(404).json({ error: `Usuario(${id}) no encontrado` });
    }

    // Obtener los datos del cuerpo de la petición
    const { firstName, lastName } = req.body;
    // Actualizar el usuario en la base de datos con los nuevos datos
    await user.update({ firstName, lastName });
    // Enviar el usuario como respuesta
    return res.json(user);
  } catch (error) {
    // Si ocurre un error, enviar un mensaje de error
    console.error(`Error al actualizar el usuario: ${error}`);
    return res.status(400).json({ error: error.message || error });
  }
};

// Crear una función que elimine un usuario por su id
exports.deleteUserById = async (req, res) => {
  // Obtener el id del usuario de los parámetros de la ruta
  const { id } = req.params;
  try {
    // Buscar el usuario por su id en la base de datos
    const user = await User.findByPk(id);

    // Si no se encuentra el usuario, enviar un mensaje de error
    if (!user) {
      return res.status(404).json({ error: `Usuario(${id}) no encontrado` });
    }

    // Eliminar el usuario de la base de datos
    await user.destroy();
    // Enviar el usuario como respuesta
    return res.json(user);
  } catch (error) {
    // Si ocurre un error, enviar un mensaje de error
    console.error(`Error al eliminar el usuario: ${error}`);
    return res.status(400).json({ error: error.message || error });
  }
};

// Crear una función que inicie sesión con un usuario
exports.signIn = async (req, res) => {
  // Obtener el email y la contraseña del cuerpo de la petición
  const { email, password: passFromBody } = req.body;
  try {
    // Buscar el usuario por su email en la base de datos
    const user = await User.findOne({
      raw: true,
      where: { email },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    // Si no se encuentra el usuario, enviar un mensaje de error
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Obtener el hash de la contraseña y el resto de la información del usuario
    const { password, ...infoUser } = user;
    // Comparar la contraseña introducida con el hash almacenado usando el módulo Password
    if (!Password.compare(passFromBody, password)) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    // Generar un token de acceso usando la clave privada
    const accessToken = sign(infoUser, PRIVATE_KEY);
    // Enviar el token y la información del usuario como respuesta
    return res.json({ ...infoUser, accessToken });
  } catch (error) {
    // Si ocurre un error, enviar un mensaje de error
    return res.status(400).json({ error: error.message || error });
  }
};
