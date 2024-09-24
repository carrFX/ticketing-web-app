"use client";
import { detailEventFetchDb } from "@/data/eventData";
import { getTicketByIdFetchDb } from "@/data/ticketsData";
import { buyTicketsFetchDb } from "@/data/transactionData";
import { ProfileFetchDb } from "@/data/userData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { MdAccountBalanceWallet, MdOutlineEventSeat,MdOutlinePriceChange } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { toast } from "react-toastify";

const page = ({params}: {params: {eventId: string, ticketId: string}}) => {
    const router = useRouter()
    const {eventId,ticketId} = params
    const [point, setPoint] = useState(0)
    const [pointActive, setPointActive] = useState(false)
    const [coupon, setCoupon] = useState(0)
    const [couponActive, setCouponActive] = useState(false)
    const [balance, setBalance] = useState(0)
    const [titleTicket, setTitleTicket] = useState('')
    const [price, setPrice] = useState(0)
    const [category, setCategory] = useState("")
    const [sumBuying, setSumBuying] = useState(0)
    useEffect(() => {
        userProfile()
        getTitleTickets()
        getDetailTickets()
    },[])
    const userProfile = async () => {
    const { result, ok } = await ProfileFetchDb();
    if(!ok) return
    setBalance(result.data.saldo);
    setCoupon(result.data.coupon)
    setPoint(result.data.points)
    }

    const getTitleTickets = async () => {
        const { result, ok } = await detailEventFetchDb(eventId);
        try {
          if(!ok) throw result.message
          setTitleTicket(result.data.title)
        } catch (error) {
          console.log(error as string)
        }
      }
    const getDetailTickets = async () => {
        const { result, ok } = await getTicketByIdFetchDb(ticketId);
        try {
          if(!ok) throw result.message
          setPrice(result.data.price)
          setCategory(result.data.roleTicket)
        } catch (error) {
          console.log(error as string)
        }
    }

    const buyTickets = async() => {
      let data: any = {
        "eventId" : eventId,
        "useCoupon" : couponActive,
        "usePoint" : pointActive,
        "roleTicket" : category
      }
      const { result, ok } = await buyTicketsFetchDb(data)
      try {
        if(!ok) throw result.message
        toast.success(result.message)
        router.push('/')
      } catch (error) {
        toast.error(error as string)
      }
    }
  return (
    <div>
        <div className="w-full text-center my-6">
            <h1 className="uppercase tracking-wider font-semibold text-3xl text-neutral-200">
                TRANSACTION
            </h1>
        </div>
        <div className="w-90% border border-neutral-200">
            <div className='w-full h-[50px] border-b border-b-neutral-200 flex justify-between items-center px-2 md:px-4 py-1 md:py-2'>
              <div className='flex justify-center items-center gap-2'>
                <MdOutlineEventSeat className='text-2xl'/> 
                <h1 className='text-md font-bold tracking-wider uppercase text-white'>Event</h1>
              </div>
              <div>
                <p className='text-md font-bold text-[#ffffff7a] tracking- truncate'>{titleTicket}</p>
              </div>
            </div>

            <div className='w-full h-[50px] border-b border-b-neutral-200 flex justify-between items-center px-2 md:px-4 py-1 md:py-2'>
              <div className='flex justify-center items-center gap-2'>
                <TbCategory className='text-2xl'/> 
                <h1 className='text-md font-bold tracking-wider uppercase text-white'>Category</h1>
              </div>
              <div>
                <p className='text-md font-bold text-[#ffffff7a] tracking- truncate'>{category}</p>
              </div>
            </div>
          
            <div className='w-full h-[50px] border-b border-b-neutral-200 flex justify-between items-center px-2 md:px-4 py-1 md:py-2'>
              <div className='flex justify-center items-center gap-2'>
                <MdOutlinePriceChange className='text-2xl'/> 
                <h1 className='text-md font-bold tracking-wider uppercase text-white'>Price</h1>
              </div>
              <div>
              <p className='text-md font-bold text-[#ffffff7a] tracking-wide'>{
              new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                 couponActive && price * 0.9 || pointActive && price - point || price
              )
              }</p>
              </div>
            </div>
        </div>
        <div>
          {/* balance */}
          <div className='w-full my-6 h-[50px] border border-blue-800 rounded-xl flex justify-between items-center px-2 md:px-4 py-1 md:py-2'>
            <div className='flex justify-center items-center gap-2'>
              <MdAccountBalanceWallet className='text-2xl'/> 
              <h1 className='text-md font-bold tracking-wider uppercase text-white'>Balance</h1>
            </div>
            <div>
              <p className='text-md font-bold text-[#ffffff7a] tracking- truncate'>{
              new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                couponActive && balance - price * 0.9 || pointActive && balance - (price - point) || balance
              )
              }</p>
            </div>
          </div>

          <div className="flex my-4 mb-2 justify-center items-center gap-3">
            <div onClick={() => setCouponActive(!couponActive)} className={`
              ${!coupon || pointActive? "hidden" : ""}
              ${couponActive? "bg-opacity-50" : ""}
              cursor-pointer hover:scale-95 rounded-xl w-fit px-3 py-1 bg-green-800 flex justify-center items-center gap-2`}>
                <RiCoupon2Line/>
                <p className="tracking-wider">DISCOUNT COUPON 10%</p>
            </div>

            <div onClick={() => setPointActive(!pointActive)} className={`
              ${!point || couponActive? "hidden" : ""}
              ${pointActive? "bg-opacity-50" : ""}
              cursor-pointer hover:scale-95 rounded-xl w-fit px-3 py-1 bg-green-800 flex justify-center items-center gap-2`}>
                <RiCoupon2Line/>
                <p className="tracking-wider">DISCOUNT POINT</p>
            </div>
          </div>
          <div className="w-full flex my-4 justify-center items-center">
            <div
              className="button rounded-full px-5 py-1 before:bg-blue-800 font-bold text-xl text-white cursor-pointer"
              onClick={buyTickets}
            >
              BUY
            </div>
          </div>
        </div>
    </div>
  )
}

export default page