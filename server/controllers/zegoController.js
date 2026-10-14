import { generateToken04 } from "../utils/zegoToken.js";

export const generateZegoToken = async (req, res, next) => {
  try {
    const { roomId } = req.body;

    // Validate the requested room.
    if (
      typeof roomId !== "string" ||
      !roomId.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: "A valid room ID is required.",
      });
    }

    // Get the authenticated user ID from the verified JWT.
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authenticated user ID is missing.",
      });
    }

    const appID = Number(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER_SECRET;

    if (
      !Number.isSafeInteger(appID) ||
      appID <= 0 ||
      !serverSecret
    ) {
      return res.status(500).json({
        success: false,
        error: "ZEGO server configuration is missing or invalid.",
      });
    }

    const normalizedRoomId = roomId.trim();
    const normalizedUserId = String(userId);

    // Generate the basic ZEGO Token04.
    const token = generateToken04(
      appID,
      normalizedUserId,
      serverSecret,
      3600,
      ""
    );

    return res.status(200).json({
      success: true,
      data: {
        token,
        roomId: normalizedRoomId,
        userId: normalizedUserId,
      },
    });
  } catch (error) {
    console.error(
      "ZEGO token generation failed:",
      error.message
    );

    next(error);
  }
};