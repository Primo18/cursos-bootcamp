// Importar el módulo de modelos
const { bootcamps: Bootcamp, users: User } = require("../models");

// Crear una función que cree un bootcamp
exports.createBootcamp = async (req, res) => {
  // Obtener los datos del cuerpo de la petición
  const { title, cue, description } = req.body;
  try {
    // Crear el bootcamp en la base de datos
    const bootcamp = await Bootcamp.create({ title, cue, description });
    // Enviar el bootcamp como respuesta
    return res.json(bootcamp);
  } catch (error) {
    // Si ocurre un error, enviar un mensaje de error
    console.error(`Error al crear el bootcamp: ${error}`);
    return res.status(400).json({ error: error.message || error });
  }
};

// Crear una función que agregue un usuario a un bootcamp
exports.addUser = async (req, res) => {
  // Obtener los ids del bootcamp y del usuario del cuerpo de la petición
  const { bootcampId, userId } = req.body;
  // Obtener el id del usuario logueado del objeto _user que se añade al verificar el token
  const loggedInUserId = req._user.id;

  // Si el id del usuario no coincide con el id del usuario logueado, enviar un mensaje de error
  if (userId !== loggedInUserId) {
    return res.status(400).json({
      error: `No puedes agregar a otro usuario a un bootcamp`,
    });
  }

  try {
    // Buscar el bootcamp y el usuario por sus ids en la base de datos
    const bootcamp = await Bootcamp.findByPk(bootcampId);
    const user = await User.findByPk(userId);

    // Si no se encuentra el bootcamp o el usuario, enviar un mensaje de error
    if (!bootcamp || !user) {
      return res.status(404).json({
        error: `Bootcamp con id(${bootcampId}) o usuario con id(${userId}) no encontrado`,
      });
    }

    // Agregar el usuario al bootcamp en la base de datos
    await bootcamp.addUser(user);
    // Enviar el bootcamp como respuesta
    return res.json(bootcamp);
  } catch (error) {
    // Si ocurre un error, enviar un mensaje de error
    console.error(`Error al agregar el usuario(${userId}) al bootcamp(${bootcampId}): ${error}`);
    return res.status(400).json({ error: error.message || error });
  }
};

// Crear una función que busque un bootcamp por su id
exports.findById = async (req, res) => {
  // Obtener el id del bootcamp de los parámetros de la ruta
  const { id } = req.params;
  // Obtener el id del usuario logueado del objeto _user que se añade al verificar el token
  const loggedInUserId = req._user.id;

  try {
    // Buscar el bootcamp por su id en la base de datos usando el scope includeUsers para incluir los usuarios registrados
    const bootcamp = await Bootcamp.scope("includeUsers").findByPk(id);

    // Si no se encuentra el bootcamp, enviar un mensaje de error
    if (!bootcamp) {
      return res.status(404).json({ error: `Bootcamp con id(${id}) no encontrado` });
    }

    // Comprobar si el usuario logueado está registrado en el bootcamp
    const isUserRegistered = bootcamp.users.some(
      (user) => user.id === loggedInUserId
    );
    // Si no está registrado, enviar un mensaje de error
    if (!isUserRegistered) {
      return res.status(400).json({
        error: "No puedes ver los detalles de un bootcamp en el que no estás registrado",
      });
    }

    // Enviar el bootcamp como respuesta si está registrado
    return res.json(bootcamp);
  } catch (error) {
    // Si ocurre un error, enviar un mensaje de error
    console.error(`Error al buscar el bootcamp(${id}): ${error}`);
    return res.status(400).json({ error: error.message || error });
  }
};

// Crear una función que busque todos los bootcamps
exports.findAll = async (_, res) => {
  try {
    // Buscar todos los bootcamps en la base de datos usando el scope includeUsers para incluir los usuarios registrados
    const bootcamps = await Bootcamp.scope("includeUsers").findAll();
    // Enviar los bootcamps como respuesta
    return res.json(bootcamps);
  } catch (error) {
    // Si ocurre un error, enviar un mensaje de error
    console.error("Error al buscar los bootcamps:", error);
    return res.status(400).json({ error: error.message || error });
  }
};
