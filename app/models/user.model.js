module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El campo del nombre es requerido"
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El campo del apellido es requerido"
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Correo electrónico actualmente registrado en la base de datos'
      },
      validate: {
        notEmpty: {
          msg: "El correo electrónico es requerido"
        },
        isEmail: {
          msg: 'Formato de correo inválido'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La contraseña es requerida"
        }
      }
    }
  });

  return User;
};
