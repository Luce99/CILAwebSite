/**
 * Script para crear los roles iniciales en la base de datos.
 * Uso: node scripts/seedRoles.js
 */
require("dotenv").config();

const mongoose = require("mongoose");
const Rol = require("../src/models/Rol");

const MONGODB_URI = process.env.MONGODB_URI;
const ROLES_TO_CREATE = ["cliente", "administrador"];

async function seedRoles() {
  console.log("[Seed] Conectando a MongoDB...");
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  });
  console.log("[Seed] Conexion exitosa.");

  const existingRoles = await Rol.find({});
  const existingNames = existingRoles.map((r) => r.nombre);
  console.log("[Seed] Roles existentes:", existingNames);

  for (const roleName of ROLES_TO_CREATE) {
    const alreadyExists = existingNames.includes(roleName);
    if (alreadyExists) {
      console.log(`[Seed] Rol '${roleName}' ya existe, omitiendo.`);
      continue;
    }
    const newRol = new Rol({ nombre: roleName });
    await newRol.save();
    console.log(`[Seed] Rol '${roleName}' creado con ID: ${newRol._id}`);
  }

  const finalRoles = await Rol.find({});
  console.log("[Seed] Roles finales:");
  for (const rol of finalRoles) {
    console.log(`  - ${rol.nombre} (ID: ${rol._id})`);
  }

  await mongoose.disconnect();
  console.log("[Seed] Finalizado.");
}

seedRoles().catch((err) => {
  console.error("[Seed] Error:", err.message);
  process.exit(1);
});
