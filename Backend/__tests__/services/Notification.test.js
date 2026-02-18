jest.mock("../../src/models/Notification");

const Notification = require("../../src/models/Notification");
const notificationService = require("../../src/services/Notification");

describe("Notification Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getNotifications", () => {
    it("debe retornar notificaciones de un usuario ordenadas por fecha", async () => {
      const mockNotifs = [
        { _id: "n1", type: "pending_approval", read: false },
        { _id: "n2", type: "change_approved", read: true },
      ];
      const sortMock = jest.fn().mockResolvedValue(mockNotifs);
      const populateMock = jest.fn().mockReturnValue({ sort: sortMock });
      Notification.find = jest.fn().mockReturnValue({ populate: populateMock });

      const result = await notificationService.getNotifications("user1");

      expect(Notification.find).toHaveBeenCalledWith({ recipient: "user1" });
      expect(result).toEqual(mockNotifs);
    });
  });

  describe("getUnreadCount", () => {
    it("debe retornar la cantidad de notificaciones no leidas", async () => {
      Notification.countDocuments = jest.fn().mockResolvedValue(3);

      const count = await notificationService.getUnreadCount("user1");

      expect(Notification.countDocuments).toHaveBeenCalledWith({
        recipient: "user1",
        read: false,
      });
      expect(count).toBe(3);
    });
  });

  describe("markNotificationRead", () => {
    it("debe marcar una notificacion como leida", async () => {
      const mockUpdated = { _id: "n1", read: true };
      const populateMock = jest.fn().mockResolvedValue(mockUpdated);
      Notification.findByIdAndUpdate = jest.fn().mockReturnValue({ populate: populateMock });

      const result = await notificationService.markNotificationRead("n1");

      expect(Notification.findByIdAndUpdate).toHaveBeenCalledWith(
        "n1",
        { read: true },
        { new: true }
      );
      expect(result).toEqual(mockUpdated);
    });
  });

  describe("markAllNotificationsRead", () => {
    it("debe marcar todas las notificaciones de un usuario como leidas", async () => {
      Notification.updateMany = jest.fn().mockResolvedValue({ modifiedCount: 5 });

      const result = await notificationService.markAllNotificationsRead("user1");

      expect(Notification.updateMany).toHaveBeenCalledWith(
        { recipient: "user1", read: false },
        { read: true }
      );
      expect(result).toBe(true);
    });
  });
});
