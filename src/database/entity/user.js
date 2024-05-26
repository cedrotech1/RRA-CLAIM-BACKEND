"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Add associations here if needed
    }
  }

  User.init(
    {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      tinnumber: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      nid: DataTypes.STRING,
      // role: DataTypes.ENUM("customer", "employee", "superadmin"),
      role: DataTypes.STRING,
      password: DataTypes.STRING,
      businessDescription: DataTypes.TEXT, 
      resetkey: DataTypes.STRING,
     
    },
    {
      sequelize,
      modelName: "User", // Use singular name for the model
    }
  );

  return User;
};
