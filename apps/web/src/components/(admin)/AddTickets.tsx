"use client";
import { useRouter } from "next/navigation"
import { useState } from "react"

const AddTickets = () => {
    const router = useRouter()
  return (
    <div className="flex justify-center items-center gap-5 my-6">
      <div onClick={() => router.back()} className="button text-2xl font-semibold rounded-full px-3 text-center py-1 uppercase tracking-wider before:bg-blue-800 text-white cursor-pointer">
        Yes
      </div>
      <div onClick={() => router.push('/')} className="button text-2xl font-semibold rounded-full px-4 text-center py-1 uppercase tracking-wider before:bg-blue-800 text-white cursor-pointer">
        No
      </div>
    </div>
  )
}

export default AddTickets