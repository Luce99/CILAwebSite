const User = require("../models/user");
const bcrypt = require("bcryptjs");
const rondasDeSal = 10;
const { UserInputError } = require ('apollo-server-errors');

createUser = async (args) => {
  try {
    const existingUser = await User.findOne({ correo: args.correo });
    if (existingUser) {
      throw new Error("El usuario ya existe");
    }
    const hashedPassword = await bcrypt.hash(args.contrasena, rondasDeSal);
    let userInstance = new User({
      nombre: args.nombre,
      apellido: args.apellido,
      correo: args.correo,
      contrasena: hashedPassword,
      direccion: "",
      Rol: "6233db911b318e2e210cc8f0",
    });
    const userSaved = await userInstance.save();
    let user = await User.findById(userSaved._id).populate({
      path: "Rol",
      model: "Rol",
    });
    return user;
  } catch (err) {
    throw err;
  }
};

getUsers = async () => {
  let user = await User.find({}).populate({
    path: "Rol",
    model: "Rol",
  }).populate({
    path: "carrito",
    model: "producto",});
  return user;
};

getUserById = async (userId) => {
  let user = await User.findById(userId).populate({
    path: "Rol",
    model: "Rol",
  }).populate({
      path: "carrito",
      model: "producto",});
  return user;
};

login = async ({ correo, contrasena }) => {

  // if (!correo, contrasena){
  //   errors.push({property: "data", message: "Por favor ingrese los datos completos"})
  // }
  let user = await User.findOne({ correo: correo }).populate({
    path: "Rol",
    model: "Rol",
  }).populate({
    path: "carrito",
    model: "producto",});
    let property;
    let message;
   const errors = [];
  if (!correo){
    errors.push({property: "data", message: "Por favor ingrese los datos completos"})
  }
  if (!contrasena){
    errors.push({property: "data", message: "Por favor ingrese los datos completos"})
  }
  if (!user) {
    errors.push({property: "user", message: "El usuario no existe"})
  }
  if (user){
  const isEqual = await bcrypt.compare(contrasena, user.contrasena);
  if (!isEqual) {
    errors.push({property: "contrasena", message: "Contraseña incorrecta"})
  }
}
  if (errors.length){
    throw new UserInputError("Entrada invalida", {
      errors,
    })
  }
  return user
}

updateUser = async (userId, user) => {
  let new_user = User.findByIdAndUpdate(userId, user, { new: true });
  return new_user;
};

deleteUser = async (userId, user, callback) => {
  let userd = User.findByIdAndDelete(userId, user, callback, { new: true });
  return userd;
};

updateVenta = async (userId, ventaId) => {
  let user = await User.findByIdAndUpdate(userId, {
    $push: {
      venta: ventaId,
    },
  });
  return user;
};


module.exports = {
  createUser,
  getUsers,
  getUserById,
  login,
  updateUser,
  deleteUser,
  updateVenta,
};
