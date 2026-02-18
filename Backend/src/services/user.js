const User = require("../models/user");
const Rol = require("../models/Rol");
const bcrypt = require("bcryptjs");
const rondasDeSal = 10;
const { UserInputError } = require ('apollo-server-errors');

const DEFAULT_ROLE_NAME = "cliente";

const DEFAULT_AVATARS = {
  femenino: "fem-1",
  masculino: "masc-1",
  no_especificado: "neu-1",
};

/** Retorna el avatar por defecto segun el genero. */
function resolveDefaultAvatar(genero) {
  return DEFAULT_AVATARS[genero] || DEFAULT_AVATARS.no_especificado;
}

/** Busca el rol "cliente" en la base de datos y retorna su ID. */
async function findDefaultRoleId() {
  const rol = await Rol.findOne({ nombre: DEFAULT_ROLE_NAME });
  if (rol) {
    return rol._id;
  }
  throw new Error("No se encontró el rol '" + DEFAULT_ROLE_NAME + "' en la base de datos.");
}

/** Crea un usuario nuevo con rol cliente, avatar segun genero y contraseña encriptada. */
createUser = async (args) => {
  const existingUser = await User.findOne({ correo: args.correo });
  if (existingUser) {
    throw new Error("El usuario ya existe");
  }

  const defaultRoleId = await findDefaultRoleId();
  const hashedPassword = await bcrypt.hash(args.contrasena, rondasDeSal);
  const genero = args.genero || "no_especificado";
  const defaultAvatar = resolveDefaultAvatar(genero);

  const userInstance = new User({
    nombre: args.nombre,
    apellido: args.apellido,
    correo: args.correo,
    contrasena: hashedPassword,
    direccion: "",
    genero: genero,
    avatar: args.avatar || defaultAvatar,
    Rol: defaultRoleId,
  });

  const userSaved = await userInstance.save();
  const user = await User.findById(userSaved._id).populate({
    path: "Rol",
    model: "Rol",
  });
  return user;
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
  let user = await User.findOne({ correo: correo }).populate({
    path: "Rol",
    model: "Rol",
  }).populate({
    path: "carrito",
    model: "producto",});
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
