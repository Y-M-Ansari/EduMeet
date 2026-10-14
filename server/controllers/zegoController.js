import { generateToken04 } from "../utils/zegoToken.js";

export const generateZegoToken = async (req, res, next) => {
  try {
    const { roomId, userName } = req.body;

    // Validate the room ID.
    if (!roomId) {
      return res.status(400).json({
        success: false,
        error: "Room ID is required.",
      });
    }

    // Obtain the user ID from authenticated middleware.
    const userId = String(req.user._id);

    const appID = Number(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER_SECRET;

    if (!Number.isSafeInteger(appID) || appID <= 0 || !serverSecret) {
      return res.status(500).json({
        success: false,
        error: "Invalid ZEGO server configuration.",
      });
    }

    // Generate a ZEGO Token04.
    const token = generateToken04(
      appID,
      userId,
      serverSecret,
      3600,
      ""
    );

    if (!token || typeof token !== "string") {
      throw new Error("ZEGO token generation failed.");
    }

    return res.status(200).json({
      success: true,
      data: {
        token,
        roomId: String(roomId),
        userId,
      },
    });
  } catch (error) {
    next(error);
  }
};