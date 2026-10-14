import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { joinRoom, leaveRoom } from "../service/zego";

export const useZego = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [userHasJoined, setUserHasJoined] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);
  const joinedRoomIdRef = useRef(null);
  const isJoiningRef = useRef(false);
  const isLeavingRef = useRef(false);

  const { user } = useAuth();

  const joinZegoRoom = useCallback(
    async (roomId) => {
      const normalizedRoomId = String(roomId || "").trim();

      // Validate room ID
      if (!normalizedRoomId) {
        const errorMessage = "Room ID is required.";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      // Avoid joining the same room twice
      if (joinedRoomIdRef.current === normalizedRoomId) {
        return { success: true };
      }

      // Prevent concurrent join attempts
      if (isJoiningRef.current || isLeavingRef.current) {
        return {
          success: false,
          error: "A room operation is already in progress.",
        };
      }

      // Validate authenticated user
      const userId = user?.id || user?._id;
      const userName = user?.name;

      if (!userId || !userName) {
        const errorMessage =
          "User ID or name is missing. Please log in again.";

        setError(errorMessage);

        return { success: false, error: errorMessage };
      }

      isJoiningRef.current = true;
      setLoading(true);
      setError(null);

      try {
        // Wait for the video container to become available
        let retries = 0;
        const maxRetries = 30;

        while (!containerRef.current && retries < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          retries++;
        }

        if (!containerRef.current) {
          throw new Error(
            "Video container is not ready. Please refresh the page and try again."
          );
        }

        const container = containerRef.current;

        // Check container dimensions
        if (
          container.offsetWidth === 0 ||
          container.offsetHeight === 0
        ) {
          console.warn(
            "Video container has zero dimensions. Check its CSS and visibility."
          );
        }

        console.log("Joining ZEGO room:", {
          roomId: normalizedRoomId,
          userId: String(userId),
          userName,
        });

        await joinRoom(
          normalizedRoomId,
          String(userId),
          userName,
          container,
          () => {
            setUserHasJoined(true);
          },
          () => {
            setUserHasJoined(false);
          }
        );

        setIsJoined(true);
        joinedRoomIdRef.current = normalizedRoomId;

        return { success: true };
      } catch (error) {
        console.error("Failed to join ZEGO room:", error);

        const errorMessage =
          error?.message ||
          "Failed to join the room. Check your camera and microphone permissions.";

        setError(errorMessage);
        setIsJoined(false);
        setUserHasJoined(false);
        joinedRoomIdRef.current = null;

        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setLoading(false);
        isJoiningRef.current = false;
      }
    },
    [user]
  );

  const leaveZegoRoom = useCallback(async () => {
    if (isLeavingRef.current || isJoiningRef.current) {
      return;
    }

    if (!joinedRoomIdRef.current) {
      return;
    }

    isLeavingRef.current = true;

    try {
      await leaveRoom(() => {
        setUserHasJoined(false);
      });

      setIsJoined(false);
      setUserHasJoined(false);
      joinedRoomIdRef.current = null;
    } catch (error) {
      console.error("Error leaving ZEGO room:", error);

      setError(error?.message || "Failed to leave the room.");
    } finally {
      isLeavingRef.current = false;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (joinedRoomIdRef.current) {
        try {
          leaveRoom();
        } catch (error) {
          console.error("Error cleaning up ZEGO room:", error);
        }

        joinedRoomIdRef.current = null;
      }
    };
  }, []);

  return {
    isJoined,
    userHasJoined,
    error,
    loading,
    containerRef,
    joinZegoRoom,
    leaveZegoRoom,
  };
};