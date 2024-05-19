"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Claims extends Model {
    static associate(models) {
      Claims.belongsTo(models.User, { foreignKey: "userid", as: "ClaimsUser" });
    }
  }

  Claims.init(
    {
      userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Claims", 
    }
  );

  return Claims;
};
