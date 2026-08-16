import React from "react";
import { FaCheck, FaCopy, FaInfoCircle } from "react-icons/fa";
import { APP_CONFIG } from "../../utils/constants";

const SessionInfoCard = ({
  roomId,
  shareableLink,
  status,
  participantCount,
  copied,
  onCopyRoomId,
  onCopyLink,
}) => {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="w-9 sm:w-10 h-9 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
          <FaInfoCircle className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          {APP_CONFIG.SESSION_CONTENT.INFO_CARD.HEADING}
        </h2>
      </div>
      <div className="mb-4 sm:mb-5">
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
          {APP_CONFIG.SESSION_CONTENT.INFO_CARD.ROOM_ID_LABEL}
        </label>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 items-stretch">
          <div className="flex-1 relative min-w-0">
            <input
              type="text"
              value={roomId}
              readOnly
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg bg-gray-50 font-mono text-sm sm:text-lg tracking-wider text-center focus:border-blue-500 transition-colors truncate"
            />
          </div>
          <button
            onClick={onCopyRoomId}
            className={`px-4 sm:px-5 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all flex-shrink-0 ${copied ? "bg-green-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            {copied ? (
              <span className="flex items-center justify-center gap-1">
                <FaCheck className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="hidden sm:inline">{APP_CONFIG.SESSION_CONTENT.INFO_CARD.COPIED_BUTTON}</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1">
                <FaCopy className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="hidden sm:inline">{APP_CONFIG.SESSION_CONTENT.INFO_CARD.COPY_BUTTON}</span>
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="mb-4 sm:mb-5">
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
          {APP_CONFIG.SESSION_CONTENT.INFO_CARD.SHAREABLE_LINK_LABEL}
        </label>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 items-stretch">
          <input
            type="text"
            value={shareableLink}
            readOnly
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-xs sm:text-sm focus:border-green-500 transition-colors truncate min-w-0"
          />
          <button
            onClick={onCopyLink}
            className={`px-4 sm:px-5 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all flex-shrink-0 ${copied ? "bg-green-500 text-white" : "bg-green-600 text-white hover:bg-green-700"}`}
          >
            {copied ? "✓" : "Copy"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-5 border-t border-gray-200">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 sm:p-4 rounded-lg border border-green-100">
          <p className="text-xs font-medium text-green-700 uppercase tracking-wide mb-1">
            {APP_CONFIG.SESSION_CONTENT.INFO_CARD.STATUS_LABEL}
          </p>
          <p className="text-lg sm:text-xl font-bold text-green-600 capitalize truncate">
            {status}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-lg border border-blue-100">
          <p className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-1">
            {APP_CONFIG.SESSION_CONTENT.INFO_CARD.PARTICIPANTS_LABEL}
          </p>
          <p className="text-lg sm:text-xl font-bold text-blue-600 capitalize">
            {participantCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionInfoCard;
