'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Enter your first name"
          },
          isAlpha: true
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Enter your last name"
          },
          isAlpha: true
        }
    },
    emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Enter an email address"
          },
          isEmail: {
            msg: "Enter an email address"
          }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "You must enter a password"
          }
        }
    },
  });

  User.associate = (models) => {
    // TODO Add associations.
    User.hasMany(models.Course, { foreignKey: "userId" });    
  };

  return User;
};