import DashboardCard from '@/components/(admin)/DashboardCard'
import React from 'react'

const page = () => {
  return (
    <div className='w-full'>
      <div className='my-5 flex justify-center items-center'>
        <h1 className='text-3xl font-bold'>DASHBOARD</h1>
      </div>
      <div className='my-5'>
        <DashboardCard />
      </div>
    </div>
  )
}

export default page