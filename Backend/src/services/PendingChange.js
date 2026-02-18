const PendingChange = require("../models/PendingChange");
const Producto = require("../models/Producto");
const Notification = require("../models/Notification");

const POPULATE_FIELDS = [
  { path: "proposedBy", model: "user", populate: { path: "Rol", model: "Rol" } },
  { path: "producto", model: "producto" },
  { path: "reviewedBy", model: "user" },
];

/** Crea una propuesta de cambio y notifica a los administradores. */
async function createPendingChange(args, proposedById) {
  const producto = await Producto.findById(args.producto);
  if (!producto) {
    throw new Error("Producto no encontrado");
  }

  const change = new PendingChange({
    changeType: args.changeType,
    producto: args.producto,
    proposedBy: proposedById,
    oldValue: args.oldValue,
    newValue: args.newValue,
    description: args.description || "",
  });
  const saved = await change.save();

  const Rol = require("../models/Rol");
  const User = require("../models/user");
  const adminRole = await Rol.findOne({ nombre: "administrador" });
  if (adminRole) {
    const admins = await User.find({ Rol: adminRole._id });
    const notifications = admins.map((admin) => ({
      recipient: admin._id,
      type: "pending_approval",
      pendingChange: saved._id,
    }));
    await Notification.insertMany(notifications);
  }

  return PendingChange.findById(saved._id).populate(POPULATE_FIELDS);
}

/** Retorna cambios pendientes filtrados por status. */
async function getPendingChanges(status) {
  const filter = status ? { status } : {};
  return PendingChange.find(filter)
    .populate(POPULATE_FIELDS)
    .sort({ createdAt: -1 });
}

/** Retorna cambios pendientes de un usuario especifico. */
async function getPendingChangesByUser(userId) {
  return PendingChange.find({ proposedBy: userId })
    .populate(POPULATE_FIELDS)
    .sort({ createdAt: -1 });
}

/** Aprueba o rechaza un cambio. Si se aprueba, aplica la modificacion al producto. */
async function reviewPendingChange(changeId, status, reviewedById, reviewNote) {
  const change = await PendingChange.findById(changeId);
  if (!change) {
    throw new Error("Cambio pendiente no encontrado");
  }
  if (change.status !== "pending") {
    throw new Error("Este cambio ya fue procesado");
  }

  change.status = status;
  change.reviewedBy = reviewedById;
  change.reviewNote = reviewNote || "";
  await change.save();

  const isApproved = status === "approved";
  if (isApproved) {
    await applyChangeToProduct(change);
  }

  const notificationType = isApproved ? "change_approved" : "change_rejected";
  await Notification.create({
    recipient: change.proposedBy,
    type: notificationType,
    pendingChange: change._id,
  });

  return PendingChange.findById(changeId).populate(POPULATE_FIELDS);
}

/** Aplica el cambio aprobado al producto correspondiente. */
async function applyChangeToProduct(change) {
  const updateField = resolveUpdateField(change.changeType);
  if (updateField) {
    await Producto.findByIdAndUpdate(change.producto, {
      [updateField]: change.newValue,
    });
  }
}

/** Resuelve el campo del producto que debe actualizarse segun el tipo de cambio. */
function resolveUpdateField(changeType) {
  const FIELD_MAP = {
    price: "price",
    stock: "stock",
  };
  return FIELD_MAP[changeType] || null;
}

module.exports = {
  createPendingChange,
  getPendingChanges,
  getPendingChangesByUser,
  reviewPendingChange,
};
