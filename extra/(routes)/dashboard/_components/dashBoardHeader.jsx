import React from 'react'
import { UserButton } from '@clerk/nextjs'

function DashboardHeader() {
  return (
    <div className='p-10 bg-gradient-to-b from-black via-gray-900 to-gray-950'>
      <h2 className='font-bold text-4xl text-white'>Stay on Top of Your Budget!</h2>
      <div className='flex justify-end'>
        <UserButton />
      </div>
    </div>
  )
}

export default DashboardHeader
