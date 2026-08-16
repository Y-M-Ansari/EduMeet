import React from "react";
import {
  FaExclamationCircle,
  FaExpand,
  FaSpinner,
  FaVideo,
} from "react-icons/fa";
import { APP_CONFIG } from "../../utils/constants";

const VideoContainer = ({
  containerRef,
  isJoined,
  userHasJoined,
  zegoError,
  zegoLoading,
  onFullscreen,
  onLeave,
  leaveButtonText,
}) => {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
          <FaVideo className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-blue-600" />
          {APP_CONFIG.SESSION_CONTENT.VIDEO.TITLE}
        </h2>
        <div className="flex flex-wrap items-center gap-2 sm:space-x-3 w-full sm:w-auto">
          {isJoined && (
            <span className="flex items-center text-xs sm:text-sm text-green-600 font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              {APP_CONFIG.SESSION_CONTENT.VIDEO.CONNECTED}
            </span>
          )}

          <button
            onClick={onFullscreen}
            className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ml-auto sm:ml-0"
          >
            <FaExpand className="inline-block mr-1 w-3 sm:w-4 h-3 sm:h-4" />
            <span className="hidden sm:inline">{APP_CONFIG.SESSION_CONTENT.VIDEO.FULLSCREEN}</span>
            <span className="sm:hidden">Full</span>
          </button>
        </div>
      </div>

      {zegoError && (
        <div className="mb-4 bg-red-50 border border-red-500 text-red-700 p-3 sm:p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <FaExclamationCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-xs sm:text-sm">{zegoError}</span>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full h-64 sm:h-96 md:h-[calc(100vh-280px)] lg:h-[calc(100vh-200px)] rounded-lg overflow-hidden bg-gray-900 border-2 border-gray-200 shadow-inner"
      />
        {zegoLoading && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center text-gray-600">
              <FaSpinner className="animate-spin h-5 w-5 mr-2" />
              <span className="text-sm">{APP_CONFIG.SESSION_CONTENT.VIDEO.CONNECTING}</span>
            </div>
          </div>
        )}

        {onLeave && !userHasJoined && (
          <div className="mt-4 sm:mt-6 flex justify-center">
            <button
              onClick={onLeave}
              className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-md transition-all transform hover:scale-105"
            >
                {leaveButtonText || APP_CONFIG.SESSION_CONTENT.VIDEO.LEAVE_BUTTON}
            </button>
          </div>
        )}
    </div>
  );
};

export default VideoContainer;
