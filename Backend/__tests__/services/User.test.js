const mongoose = require("mongoose");

jest.mock("../../src/models/user");
jest.mock("../../src/models/Rol");
jest.mock("bcryptjs");

const User = require("../../src/models/user");
const Rol = require("../../src/models/Rol");
const bcrypt = require("bcryptjs");

const userService = require("../../src/services/user");

describe("User Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsersByRoles", () => {
    it("debe retornar usuarios filtrados por nombres de rol", async () => {
      const mockRoles = [
        { _id: "role1", nombre: "administrador" },
        { _id: "role2", nombre: "colaborador" },
      ];
      const mockUsers = [
        { _id: "u1", nombre: "Admin", Rol: { nombre: "administrador" } },
      ];

      Rol.find = jest.fn().mockResolvedValue(mockRoles);
      const populateMock = jest.fn().mockResolvedValue(mockUsers);
      User.find = jest.fn().mockReturnValue({ populate: populateMock });

      const result = await userService.getUsersByRoles(["administrador", "colaborador"]);

      expect(Rol.find).toHaveBeenCalledWith({ nombre: { $in: ["administrador", "colaborador"] } });
      expect(User.find).toHaveBeenCalledWith({ Rol: { $in: ["role1", "role2"] } });
      expect(result).toEqual(mockUsers);
    });

    it("debe retornar array vacio si no hay roles coincidentes", async () => {
      Rol.find = jest.fn().mockResolvedValue([]);
      const populateMock = jest.fn().mockResolvedValue([]);
      User.find = jest.fn().mockReturnValue({ populate: populateMock });

      const result = await userService.getUsersByRoles(["inexistente"]);

      expect(result).toEqual([]);
    });
  });

  describe("createStaffUser", () => {
    it("debe crear un usuario staff con rol especifico", async () => {
      const mockSavedUser = { _id: "newUser1" };
      const mockPopulatedUser = {
        _id: "newUser1",
        nombre: "Colaborador",
        Rol: { nombre: "colaborador" },
      };

      User.findOne = jest.fn().mockResolvedValue(null);
      bcrypt.hash = jest.fn().mockResolvedValue("hashedpass");

      const saveMock = jest.fn().mockResolvedValue(mockSavedUser);
      User.mockImplementation(() => ({ save: saveMock }));

      const populateMock = jest.fn().mockResolvedValue(mockPopulatedUser);
      User.findById = jest.fn().mockReturnValue({ populate: populateMock });

      const result = await userService.createStaffUser({
        nombre: "Colaborador",
        apellido: "Test",
        correo: "colab@test.com",
        contrasena: "temp123",
        Rol: "role2",
      });

      expect(User.findOne).toHaveBeenCalledWith({ correo: "colab@test.com" });
      expect(bcrypt.hash).toHaveBeenCalledWith("temp123", 10);
      expect(result).toEqual(mockPopulatedUser);
    });

    it("debe lanzar error si el correo ya existe", async () => {
      User.findOne = jest.fn().mockResolvedValue({ _id: "existing" });

      await expect(
        userService.createStaffUser({
          nombre: "Test",
          apellido: "User",
          correo: "existing@test.com",
          contrasena: "pass",
          Rol: "role1",
        })
      ).rejects.toThrow("Ya existe un usuario con ese correo");
    });
  });

  describe("updateUser", () => {
    it("debe hashear la contrasena si se proporciona", async () => {
      bcrypt.hash = jest.fn().mockResolvedValue("newHash");
      const populateMock = jest.fn().mockResolvedValue({ _id: "u1", contrasena: "newHash" });
      User.findByIdAndUpdate = jest.fn().mockReturnValue({ populate: populateMock });

      await userService.updateUser("u1", { contrasena: "plaintext" });

      expect(bcrypt.hash).toHaveBeenCalledWith("plaintext", 10);
    });

    it("no debe hashear si no hay contrasena", async () => {
      bcrypt.hash = jest.fn();
      const populateMock = jest.fn().mockResolvedValue({ _id: "u1", nombre: "Updated" });
      User.findByIdAndUpdate = jest.fn().mockReturnValue({ populate: populateMock });

      await userService.updateUser("u1", { nombre: "Updated" });

      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });
});
