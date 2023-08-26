module.exports = (sequelize, DataTypes) => {
  const Bootcamp = sequelize.define('bootcamp', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El campo nombre (title) es requerido"
        },
      },
    },
    cue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Debes introducir un número entero"
        },
        min: {
          args: [5],
          msg: "Números de CUE es necesario, mínimo 5"
        },
        max: {
          args: [20],
          msg: "Números de CUE máximo permitido es 20"
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Se debe introducir una descripción"
        },
      },
    }
  });

  return Bootcamp;
};
