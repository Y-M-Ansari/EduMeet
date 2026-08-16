import React from 'react'
import {FaUsers} from 'react-icons/fa'
import { APP_CONFIG } from '../../utils/constants'

const ParticipantsList = ({participants, hostName, hostId}) => {

  if(!participants || participants.length === 0){
    return(
      <div className='bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 sticky top-4'>
        <div className='flex items-center mb-4'>
          <FaUsers className='w-4 sm:w-5 h-4 sm:h-5 mr-2 text-indigo-600'/>
          <h2 className='text-lg sm:text-xl font-bold text-gray-900'>
            {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.HEADING}
          </h2>

        </div>
        <div className='text-center py-4'>
          <p className='text-xs sm:text-sm text-gray-500'>
            {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.EMPTY_MESSAGE}
          </p>
        </div>

      </div>
    )
  }


  const hostParticipants = participants.filter((p) => {
    const participantUserId = p.userId?.toString?.() ?? p.user_id?.toString?.();
    const hostUserId = hostId?.toString?.();

    if (hostUserId && participantUserId) {
      return participantUserId === hostUserId;
    }

    return p.userName === hostName;
  });

  const otherParticipants = participants.filter((p) => !hostParticipants.some((hostP) => {
    const participantUserId = p.userId?.toString?.() ?? p.user_id?.toString?.();
    const hostParticipantUserId = hostP.userId?.toString?.() ?? hostP.user_id?.toString?.();
    return participantUserId && hostParticipantUserId && participantUserId === hostParticipantUserId;
  }));
  return (
    <div className='bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 sticky top-4'>
       <div className='flex items-center mb-4'>
        <FaUsers className='w-4 sm:w-5 h-4 sm:h-5 mr-2 text-indigo-600'/>
     <h2 className='text-lg sm:text-xl font-bold text-gray-900'>
            {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.HEADING} ({participants.length})
          </h2>

       </div>

       <div className='space-y-2 sm:space-y-3 max-h-96 overflow-y-auto'>
        {hostParticipants.map((p) => (
          <div key={p.userId || p.user_id} className='p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100'>
               <div className='flex items-center gap-2 sm:gap-3 min-w-0'>
                <div className='w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0'>
                <span className='text-white text-xs sm:text-sm font-semibold'>
                  {p.userName?.charAt(0)?.toUpperCase()}
                </span>
                  </div>
                  <div className='min-w-0'>
                    <p className='font-semibold text-gray-900 text-sm truncate'>
                      {p.userName}
                    </p>
                    <p className='text-xs text-blue-600 font-medium'>
                      {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.HOST_LABEL}
                    </p>
                    </div>
                </div>
               </div>
        ))}


        {otherParticipants.length > 0 && (
          <>
            <div className='pt-2 sm:pt-3 border-t border-gray-200 text-xs sm:text-sm text-gray-500'>
              {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.JOINED_USERS_LABEL}

                     {otherParticipants.map((p) => (
          <div key={p.userId || p.user_id} className='p-2 sm:p-3 bg-white rounded-lg border border-gray-200 flex items-center gap-2 sm:gap-3 min-w-0'>
                <div className='w-8 sm:w-9 h-8 sm:h-9 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 text-gray-700 font-semibold text-xs sm:text-sm'>
                  {p.userName?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className='min-w-0'>
                    <p className='font-semibold text-gray-900 text-sm truncate'>
                      {p.userName}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.PARTICIPANT_LABEL}
                    </p>
                    </div>
                </div>
        ))}
            </div>
          </>
        )}

        
       </div>
    </div>
  )
}

export default ParticipantsList