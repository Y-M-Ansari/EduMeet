export const generateZegoToken = async (req, res, next) => {
  try {
    const { roomId, userId, userName } = req.body;

    if (!roomId || !userId) {
      return res.status(400).json({ success: false, error: 'roomId and userId are required' });
    }

    if (!process.env.ZEGO_APP_ID || !process.env.ZEGO_SERVER_SECRET) {
      return res.status(500).json({
        success: false,
        error: 'Zego server config missing. Set ZEGO_APP_ID and ZEGO_SERVER_SECRET on the server, or generate the kit token in the frontend for local testing.',
      });
    }

    return res.status(501).json({
      success: false,
      error: 'Server-side token generation is not enabled in this project. Use REACT_APP_ZEGO_SERVER_SECRET in the client for local test tokens.',
    });
  } catch (error) {
    next(error);
  }
};
