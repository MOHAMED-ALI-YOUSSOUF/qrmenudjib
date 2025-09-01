import React from 'react'

const loading = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      
        <div className='animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-orange-500'></div>
    </div>
  )
}

export default loading
