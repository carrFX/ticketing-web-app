import FormRegister from '@/components/(auth)/FormRegister'
import { RegisterComp } from '@/components/(auth)/RegisterComp'
import React from 'react'

const page = () => {
  return (
    <main className='w-full flex flex-col items-center justify-center'>
      <RegisterComp/>
    </main>
  )
}

export default page