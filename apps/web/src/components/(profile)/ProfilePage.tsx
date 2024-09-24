"use client"
import React, { useEffect, useState } from 'react'
import EditAvaComp from './EditAvaComp'
import DeleteAvaComp from './DeleteAvaComp'
import { ProfileFetchDb } from '@/data/userData'
import { MdOutlineSwitchAccount } from "react-icons/md";
import { GiTwoCoins } from "react-icons/gi";
import { RiCoupon2Line } from "react-icons/ri";
import { PiQrCodeThin } from "react-icons/pi";
import { MdAccountBalanceWallet } from "react-icons/md";

const ProfilePage = () => {
  const [balance, setBalance] = useState(0)
  const [avatar, setAvatar] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [point, setPoint] = useState(0)
  const [coupon, setCoupon] = useState(0)
  const [referral, setReferral] = useState('')

  useEffect(() => {
    userProfile()
  })
  const userProfile = async () => {
    const { result, ok } = await ProfileFetchDb();
    if(!ok) return
    console.log(result.data)
    setBalance(result.data.saldo);
    setAvatar(result.data.avatar);
    setUsername(result.data.username);
    setEmail(result.data.email);
    setCoupon(result.data.coupon);
    setReferral(result.data.referralTo);
    setRole(result.data.role);
    setPoint(result.data.points);
  }
  return (
    <div className='w-full flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0'>
      <div className='w-full flex flex-col justify-center items-center md:w-1/2 md:h-screen gap-6'>
        <div className='flex justify-center items-center p-2 border rounded-full border-y-white border-x-blue-800'>
        <img src={avatar} alt="profile_user" className='rounded-full object-cover aspect-square md:h-[200px] md:w-[200px] h-[150px] w-[150px]'/>
        </div>
        <div className='text-center'>
        <h1 className='text-4xl font-bold tracking-wider'>{username}</h1>
        <p className='text-lg text-[#ffffff7a] tracking-widest'>{email}</p>
        </div>
        <div className='flex justify-center items-center gap-3'>
          <EditAvaComp/>
          <DeleteAvaComp/>
        </div>
      </div>
      {/* profile detail */}
      <div className='w-full md:w-1/2 md:h-screen flex flex-col justify-center items-center gap-2'>
        {/* balance */}
        <div className='w-[80%] h-[50px] border border-blue-800 rounded-full flex justify-between items-center px-2 md:px-4 py-1 md:py-2'>
          <div className='flex justify-center items-center gap-2'>
            <MdAccountBalanceWallet className='text-2xl'/> 
            <h1 className='text-md font-bold tracking-wider uppercase text-white'>Balance</h1>
          </div>
          <p className='text-md font-bold text-[#ffffff7a] tracking-wide'>{
            new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(balance)
            }</p>
        </div>
        {/* role */}
        <div className='w-[80%] h-[50px] border border-blue-800 rounded-full flex justify-between items-center px-2 md:px-4 py-1 md:py-2'>
          <div className='flex justify-center items-center gap-2'>
            <MdOutlineSwitchAccount className='text-2xl'/> 
            <h1 className='text-md font-bold tracking-wider uppercase text-white'>Account type</h1>
          </div>
          <p className='text-md font-bold text-[#ffffff7a] tracking-wide'>{role} account</p>
        </div>
        {/* point */}
        <div className='w-[80%] h-[50px] border border-blue-800 rounded-full flex justify-between items-center px-2 md:px-4 py-1 md:py-2'>
          <div className='flex justify-center items-center gap-2'>
            <GiTwoCoins className='text-2xl'/> 
            <h1 className='text-md font-bold tracking-wider uppercase text-white'>Points</h1>
          </div>
          <p className='text-md font-bold text-[#ffffff7a] tracking-wide'>{point} points</p>
        </div>
        {/* coupon */}
        <div className='w-[80%] h-[50px] border border-blue-800 rounded-full flex justify-between items-center px-2 md:px-4 py-1 md:py-2'>
          <div className='flex justify-center items-center gap-2'>
            <RiCoupon2Line className='text-2xl'/> 
            <h1 className='text-md font-bold tracking-wider uppercase text-white'>Coupons</h1>
          </div>
          <p className='text-md font-bold text-[#ffffff7a] tracking-wide'>{coupon} coupons</p>
        </div>
        {/* referral */}
        <div className='w-[80%] h-[50px] border border-blue-800 rounded-full flex justify-between items-center px-2 md:px-4 py-1 md:py-2'>
          <div className='flex justify-center items-center gap-2'>
            <PiQrCodeThin className='text-2xl'/> 
            <h1 className='text-md font-bold tracking-wider uppercase text-white'>Referral</h1>
          </div>
          <p className='text-md font-bold text-[#ffffff7a] tracking-wide'>{referral}</p>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage