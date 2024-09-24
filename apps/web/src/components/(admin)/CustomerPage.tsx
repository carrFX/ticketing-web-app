"use client";
import { getCustomersFetchDb } from '@/data/adminData';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export interface ICustomer {
    id: number
    avatar: string
    username: string
    email: string
}

const CustomerPage = () => {
    const router = useRouter()
    const [customer, setCustomer]: [ICustomer[], any] = useState([])

    useEffect(() => {
        dataCustomer();
    },[])

    const dataCustomer = async () => {
        const { result, ok } = await getCustomersFetchDb();
        try {
            if (!ok) throw result;
            console.log(result.data.user)
            setCustomer(result.data.user.map((user: any, index: number) => ({ ...user, no: index + 1 })))
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div>
        {customer.map((user) => {
            return (
                <div key={user.id} className="px-4 py-2 border border-blue-800 rounded-full flex justify-start items-center gap-2 my-4">
                    <div className='flex justify-center items-center rounded'>
                    <img src={user.avatar} alt={user.username} className='rounded-full object-cover aspect-video md:h-[100px] md:w-[170px] h-[50px] w-[100px]'/>
                    </div>
                    <div className="h-full w-2/3 flex flex-col justify-center items-center">
                    <div className="w-2/3 text-center">
                        <h1 className="text-2xl text-center font-bold tracking-wider group-hover:text-white duration-300 text-neutral-200">{user.username}</h1>
                    </div>
                    <div className="w-2/3 text-center">
                        <p className="text-lg text-center text-neutral-300 group-hover:text-white duration-300 tracking-wider truncate">{user.email}</p>
                    </div>
                    </div>
                    <div className="px-4">
                    <h1 className="text-5xl uppercase font-extrabold text-blue-800 tracking-wider">{user.id}</h1>
                    </div>
                </div>
            )
        })}
    </div>
  )
}

export default CustomerPage