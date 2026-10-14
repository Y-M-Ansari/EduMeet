import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ZEGO_CONFIG } from "../utils/constants";
import api from "./api";

let zegoInstance = null;
let userHasJoined = false;
let isDestroying = false;

// Request browser permissions for camera and microphone.
const requestMediaPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    stream.getTracks().forEach((track) => track.stop());

    return true;
  } catch (error) {
    console.warn("Media permission was not granted:", error);
    return false;
  }
};

// Generate a ZEGO token using the authenticated backend.
export const generateKitToken = async (roomId, userId, userName) => {
  if (!ZEGO_CONFIG.APP_ID) {
    throw new Error(
      "ZEGO App ID is missing. Configure REACT_APP_ZEGO_APP_ID."
    );
  }

  if (!roomId || !userId || !userName) {
    throw new Error("Room ID, user ID, and username are required.");
  }

  try {
    // The backend should obtain the authenticated user ID
    // from the authentication middleware.
    const response = await api.post("/zego/token", {
      roomId,
      userName,
    });

    const token = response?.data?.data?.token;

    if (!token || typeof token !== "string") {
      console.error("Invalid ZEGO token response:", {
        status: response?.status,
        response: response?.data,
      });

      throw new Error("The backend did not return a valid ZEGO token.");
    }

    return token;
  } catch (error) {
    console.error("ZEGO token request failed:", {
      status: error.response?.status,
      response: error.response?.data,
      message: error.message,
    });

    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "Unable to generate the ZEGO token."
    );
  }
};

// Join a ZEGO room.
export const joinRoom = async (
  roomId,
  userId,
  userName,
  container,
  onJoinCallback,
  onLeaveCallback
) => {
  if (!container) {
    throw new Error("The video container element is required.");
  }

  if (!roomId || !userId || !userName) {
    throw new Error("Room ID, user ID, and username are required.");
  }

  if (!ZEGO_CONFIG.APP_ID) {
    throw new Error("ZEGO App ID is not configured.");
  }

  if (zegoInstance || isDestroying) {
    throw new Error(
      "A ZEGO instance already exists or is being destroyed. Leave the current room before joining another."
    );
  }

  let zp = null;

  try {
    const normalizedRoomId = String(roomId).trim();
    const normalizedUserId = String(userId);
    const normalizedUserName = String(userName);

    console.log("Requesting ZEGO token:", {
      roomId: normalizedRoomId,
      userId: normalizedUserId,
      userName: normalizedUserName,
      appId: ZEGO_CONFIG.APP_ID,
    });

    // Ask the backend for the token.
    const kitToken = await generateKitToken(
      normalizedRoomId,
      normalizedUserId,
      normalizedUserName
    );

    if (!kitToken) {
      throw new Error("The ZEGO token is empty.");
    }

    // Create the ZEGO UIKit instance.
    zp = ZegoUIKitPrebuilt.create(kitToken);

    if (!zp) {
      throw new Error("Failed to create the ZEGO UIKit instance.");
    }

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    console.log("Attempting to join ZEGO room:", {
      roomId: normalizedRoomId,
      userId: normalizedUserId,
    });

    // Enter the room.
    // Keep the existing ZEGO UIKit configuration.
    await zp.joinRoom({
      container,

      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },

      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,

      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: true,
      showScreenSharingButton: true,

      screenSharingConfig: {
        maxScreenShareCount: 1,
        startSharingScreenTextEN: "Share Screen",
        stopSharingScreenTextEN: "Stop Sharing",
      },

      showTextChat: true,
      showUserList: true,

      layout: isMobile ? "Gallery" : "Sidebar",
      videoResolutionDefault: isMobile ? "360p" : "720p",

      onJoinRoom: () => {
        userHasJoined = true;

        if (typeof onJoinCallback === "function") {
          onJoinCallback();
        }
      },

      onLeaveRoom: () => {
        userHasJoined = false;

        if (typeof onLeaveCallback === "function") {
          onLeaveCallback();
        }
      },

      onError: (error) => {
        console.error("ZEGO SDK error:", error);

        console.error("ZEGO room details:", {
          roomId: normalizedRoomId,
          userId: normalizedUserId,
          appId: ZEGO_CONFIG.APP_ID,
        });
      },
    });

    zegoInstance = zp;

    return zp;
  } catch (error) {
    console.error("Failed to join ZEGO room:", error);

    if (zp && typeof zp.destroy === "function") {
      try {
        zp.destroy();
      } catch (destroyError) {
        console.error("Failed to destroy ZEGO instance:", destroyError);
      }
    }

    zegoInstance = null;
    userHasJoined = false;

    throw new Error(
      error?.message || "Failed to join the ZEGO room."
    );
  }
};

// Leave the current ZEGO room.
export const leaveRoom = (onLeaveCallback) => {
  if (!zegoInstance || isDestroying) {
    if (typeof onLeaveCallback === "function") {
      onLeaveCallback();
    }

    return;
  }

  isDestroying = true;

  const instance = zegoInstance;

  zegoInstance = null;
  userHasJoined = false;

  try {
    if (typeof onLeaveCallback === "function") {
      onLeaveCallback();
    }

    if (instance && typeof instance.destroy === "function") {
      instance.destroy();
    } else if (instance && typeof instance.leaveRoom === "function") {
      instance.leaveRoom();
    }
  } catch (error) {
    console.error("Error leaving ZEGO room:", error);
  } finally {
    isDestroying = false;
  }
};

export const getZegoInstance = () => zegoInstance;

export const hasUserJoined = () => userHasJoined;