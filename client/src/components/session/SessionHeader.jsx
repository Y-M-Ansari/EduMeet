import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { APP_CONFIG } from '../../utils/constants'

const SessionHeader = ({title,roomId,userName,onBack,showEndBUtton,onEndSession}) => {
  return (
   <header className='bg-white shadow-sm border-b border-gray-200'>
    <div className='max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4'>
            <div className='flex items-center gap-2 sm:gap-4 min-w-0'>
                <button
                 onClick={onBack}
                 className='p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0'
                >
                    <FaArrowLeft className='w-4 sm:w-5 h-4 sm:h-5'/>
                </button>
                <div className='min-w-0'>
                    <h1 className='text-base sm:text-xl font-bold text-gray-900 truncate'>
                        {title}
                    </h1>
                    <p className='text-xs sm:text-sm text-gray-500 truncate'>
                        ID: {roomId}
                    </p>
                </div>

            </div>

            <div className='flex flex-wrap items-center gap-2 sm:gap-4'>
                {userName && (
                    <div className='hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg flex-shrink-0'>
                        <div className='w-7 sm:w-8 h-7 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0'>
                            <span className='text-white text-xs font-semibold'>
                                {userName?.charAt(0).toUpperCase()}
                            </span>
                            </div>
                            <span className='text-gray-700 font-medium text-xs sm:text-sm hidden md:inline'>
                                {userName}
                            </span>
                        </div>
                )}

                {showEndBUtton && (
                    <button
                     onClick={onEndSession}
                     className='px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm flex-shrink-0'
                    >
                        {APP_CONFIG.SESSION_CONTENT.HEADER.END_SESSION_BUTTON}
                    </button>
                )}

            </div>

        </div>

    </div>
   </header>
  )
}

export default SessionHeader