jest.mock("../../src/models/PendingChange");
jest.mock("../../src/models/Producto");
jest.mock("../../src/models/Notification");
jest.mock("../../src/models/Rol");
jest.mock("../../src/models/user");

const PendingChange = require("../../src/models/PendingChange");
const Producto = require("../../src/models/Producto");
const Notification = require("../../src/models/Notification");
const Rol = require("../../src/models/Rol");
const User = require("../../src/models/user");

const pendingChangeService = require("../../src/services/PendingChange");

describe("PendingChange Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createPendingChange", () => {
    it("debe crear un cambio pendiente y notificar a los admins", async () => {
      const mockProduct = { _id: "prod1", name: "Camiseta", price: 50000 };
      const mockSaved = { _id: "change1" };
      const mockPopulated = { _id: "change1", status: "pending", producto: mockProduct };

      Producto.findById = jest.fn().mockResolvedValue(mockProduct);

      const saveMock = jest.fn().mockResolvedValue(mockSaved);
      PendingChange.mockImplementation(() => ({ save: saveMock }));

      Rol.findOne = jest.fn().mockResolvedValue({ _id: "adminRoleId" });
      User.find = jest.fn().mockResolvedValue([{ _id: "admin1" }]);
      Notification.insertMany = jest.fn().mockResolvedValue([]);

      const populateMock = jest.fn().mockResolvedValue(mockPopulated);
      PendingChange.findById = jest.fn().mockReturnValue({ populate: populateMock });

      const result = await pendingChangeService.createPendingChange(
        {
          changeType: "price",
          producto: "prod1",
          oldValue: 50000,
          newValue: 45000,
          description: "Descuento",
        },
        "user1"
      );

      expect(Producto.findById).toHaveBeenCalledWith("prod1");
      expect(Notification.insertMany).toHaveBeenCalled();
      expect(result).toEqual(mockPopulated);
    });

    it("debe lanzar error si el producto no existe", async () => {
      Producto.findById = jest.fn().mockResolvedValue(null);

      await expect(
        pendingChangeService.createPendingChange(
          { changeType: "price", producto: "fake", oldValue: 0, newValue: 0 },
          "user1"
        )
      ).rejects.toThrow("Producto no encontrado");
    });
  });

  describe("getPendingChanges", () => {
    it("debe retornar cambios filtrados por status", async () => {
      const mockChanges = [{ _id: "c1", status: "pending" }];
      const sortMock = jest.fn().mockResolvedValue(mockChanges);
      const populateMock = jest.fn().mockReturnValue({ sort: sortMock });
      PendingChange.find = jest.fn().mockReturnValue({ populate: populateMock });

      const result = await pendingChangeService.getPendingChanges("pending");

      expect(PendingChange.find).toHaveBeenCalledWith({ status: "pending" });
      expect(result).toEqual(mockChanges);
    });

    it("debe retornar todos los cambios si no se pasa status", async () => {
      const sortMock = jest.fn().mockResolvedValue([]);
      const populateMock = jest.fn().mockReturnValue({ sort: sortMock });
      PendingChange.find = jest.fn().mockReturnValue({ populate: populateMock });

      await pendingChangeService.getPendingChanges(null);

      expect(PendingChange.find).toHaveBeenCalledWith({});
    });
  });

  describe("reviewPendingChange", () => {
    it("debe aprobar un cambio y aplicarlo al producto", async () => {
      const mockChange = {
        _id: "c1",
        status: "pending",
        proposedBy: "user1",
        changeType: "price",
        producto: "prod1",
        newValue: 45000,
        save: jest.fn().mockResolvedValue(true),
      };

      PendingChange.findById = jest.fn()
        .mockResolvedValueOnce(mockChange)
        .mockReturnValue({
          populate: jest.fn().mockResolvedValue({ ...mockChange, status: "approved" }),
        });

      Producto.findByIdAndUpdate = jest.fn().mockResolvedValue({});
      Notification.create = jest.fn().mockResolvedValue({});

      const result = await pendingChangeService.reviewPendingChange(
        "c1",
        "approved",
        "admin1",
        "Aprobado"
      );

      expect(mockChange.save).toHaveBeenCalled();
      expect(Producto.findByIdAndUpdate).toHaveBeenCalledWith("prod1", { price: 45000 });
      expect(Notification.create).toHaveBeenCalled();
    });

    it("debe rechazar un cambio sin aplicarlo al producto", async () => {
      const mockChange = {
        _id: "c2",
        status: "pending",
        proposedBy: "user1",
        changeType: "stock",
        producto: "prod1",
        newValue: 100,
        save: jest.fn().mockResolvedValue(true),
      };

      PendingChange.findById = jest.fn()
        .mockResolvedValueOnce(mockChange)
        .mockReturnValue({
          populate: jest.fn().mockResolvedValue({ ...mockChange, status: "rejected" }),
        });

      Notification.create = jest.fn().mockResolvedValue({});

      await pendingChangeService.reviewPendingChange("c2", "rejected", "admin1", "No procede");

      expect(Producto.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("debe lanzar error si el cambio no existe", async () => {
      PendingChange.findById = jest.fn().mockResolvedValue(null);

      await expect(
        pendingChangeService.reviewPendingChange("fake", "approved", "admin1", "")
      ).rejects.toThrow("Cambio pendiente no encontrado");
    });

    it("debe lanzar error si el cambio ya fue procesado", async () => {
      PendingChange.findById = jest.fn().mockResolvedValue({ status: "approved" });

      await expect(
        pendingChangeService.reviewPendingChange("c1", "approved", "admin1", "")
      ).rejects.toThrow("Este cambio ya fue procesado");
    });
  });
});
