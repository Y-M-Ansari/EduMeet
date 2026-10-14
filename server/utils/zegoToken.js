import crypto from "crypto";

const makeRandomIv = () => {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";

  let result = "";

  for (let i = 0; i < 16; i++) {
    const index = crypto.randomInt(0, chars.length);
    result += chars[index];
  }

  return result;
};

const makeNonce = () => {
  return crypto.randomInt(-2147483648, 2147483647);
};

export const generateToken04 = (
  appID,
  userID,
  serverSecret,
  effectiveTimeInSeconds,
  payload = ""
) => {
  // Validate App ID.
  if (
    typeof appID !== "number" ||
    !Number.isSafeInteger(appID) ||
    appID <= 0
  ) {
    throw new Error("Invalid ZEGO App ID.");
  }

  // Validate user ID.
  if (
    typeof userID !== "string" ||
    !userID ||
    userID.length > 64
  ) {
    throw new Error("Invalid ZEGO user ID.");
  }

  // ZEGO ServerSecret must be exactly 32 characters.
  if (
    typeof serverSecret !== "string" ||
    serverSecret.length !== 32 ||
    Buffer.byteLength(serverSecret, "utf8") !== 32
  ) {
    throw new Error(
      "Invalid ZEGO ServerSecret. It must be exactly 32 bytes."
    );
  }

  if (
    !Number.isSafeInteger(effectiveTimeInSeconds) ||
    effectiveTimeInSeconds <= 0
  ) {
    throw new Error("Invalid token expiration duration.");
  }

  const createTime = Math.floor(Date.now() / 1000);
  const expireTime = createTime + effectiveTimeInSeconds;

  const tokenInfo = {
    app_id: appID,
    user_id: userID,
    nonce: makeNonce(),
    ctime: createTime,
    expire: expireTime,
    payload: payload || "",
  };

  const plainText = JSON.stringify(tokenInfo);
  const iv = makeRandomIv();

  const key = Buffer.from(serverSecret, "utf8");
  const ivBuffer = Buffer.from(iv, "utf8");

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    key,
    ivBuffer
  );

  cipher.setAutoPadding(true);

  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);

  if (encrypted.length > 65535) {
    throw new Error("ZEGO token payload is too large.");
  }

  // Token04 binary structure:
  // 8 bytes: expiration timestamp
  // 2 bytes: IV length
  // 16 bytes: IV
  // 2 bytes: encrypted payload length
  // Remaining bytes: encrypted payload

  const expirationBuffer = Buffer.alloc(8);
  expirationBuffer.writeBigInt64BE(BigInt(expireTime));

  const ivLengthBuffer = Buffer.alloc(2);
  ivLengthBuffer.writeUInt16BE(ivBuffer.length);

  const encryptedLengthBuffer = Buffer.alloc(2);
  encryptedLengthBuffer.writeUInt16BE(encrypted.length);

  const tokenBuffer = Buffer.concat([
    expirationBuffer,
    ivLengthBuffer,
    ivBuffer,
    encryptedLengthBuffer,
    encrypted,
  ]);

  return `04${tokenBuffer.toString("base64")}`;
};