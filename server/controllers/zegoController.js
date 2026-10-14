import crypto from 'crypto';

const createRandomString = (length = 16) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let value = '';

  while (value.length < length) {
    value += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return value.slice(0, length);
};

const generateZegoKitTokenForTest = ({
  appID,
  serverSecret,
  roomID,
  userID,
  userName,
  expirationSeconds = 7200,
}) => {
  if (!appID || !serverSecret || !roomID || !userID) {
    throw new Error('appID, serverSecret, roomID, and userID are required');
  }

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    app_id: Number(appID),
    user_id: String(userID),
    nonce: Math.floor(Math.random() * 2147483647),
    ctime: now,
    expire: now + expirationSeconds,
  };

  const iv = createRandomString(16);
  const secretBuffer = Buffer.from(serverSecret, 'utf8');
  const key = Buffer.alloc(32);
  secretBuffer.copy(key, 0, 0, Math.min(secretBuffer.length, 32));

  const cipher = crypto.createCipheriv('aes-256-cbc', key, Buffer.from(iv, 'utf8'));
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), 'utf8'),
    cipher.final(),
  ]);

  const buffer = Buffer.alloc(28 + encrypted.length);
  buffer.set([0, 0, 0, 0], 0);
  buffer.writeUInt32BE(payload.expire, 4);
  buffer[8] = (iv.length >> 8) & 0xff;
  buffer[9] = iv.length & 0xff;
  buffer.write(iv, 10, 'utf8');
  buffer[26] = (encrypted.length >> 8) & 0xff;
  buffer[27] = encrypted.length & 0xff;
  encrypted.copy(buffer, 28);

  const body = Buffer.from(buffer).toString('base64');
  const metadata = Buffer.from(
    JSON.stringify({
      userID: String(userID),
      roomID: String(roomID),
      userName: encodeURIComponent(userName || String(userID)),
      appID: Number(appID),
    }),
    'utf8',
  ).toString('base64');

  return `04${body}#${metadata}`;
};

export const generateZegoToken = async (req, res, next) => {
  try {
    const { roomId, userId, userName } = req.body;

    if (!roomId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'roomId and userId are required',
      });
    }

    const appID = Number(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER_SECRET;

    if (!appID || !serverSecret) {
      return res.status(500).json({
        success: false,
        error: 'Zego server config missing. Set ZEGO_APP_ID and ZEGO_SERVER_SECRET on the server.',
      });
    }

    const token = generateZegoKitTokenForTest({
      appID,
      serverSecret,
      roomID: String(roomId),
      userID: String(userId),
      userName: userName ? String(userName) : String(userId),
      expirationSeconds: 3600,
    });

    return res.status(200).json({
      success: true,
      data: {
        token,
        roomId: String(roomId),
        userId: String(userId),
      },
    });
  } catch (error) {
    next(error);
  }
};
