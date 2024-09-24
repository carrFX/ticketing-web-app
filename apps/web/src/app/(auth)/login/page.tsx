import FormLogin from '@/components/(auth)/FormLogin'
import { LoginComp } from '@/components/(auth)/LoginComp'
import React from 'react'

const page = () => {
  return (
    <main className='w-full flex flex-col items-center justify-center'>
      <LoginComp/>
    </main>
  )
}

export default page