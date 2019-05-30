'use strict';

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Enter a name for the course"
        }
      }
    },
    description:{
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Enter a description for the course"
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    materialsNeeded: {
        type: DataTypes.STRING,
        allowNull: true,
      },
  });

  Course.associate = (models) => {
   // TODO Add associations. Creates foreign key
   Course.belongsTo(models.User, { foreignKey: "userId"});
  };

  return Course;
};