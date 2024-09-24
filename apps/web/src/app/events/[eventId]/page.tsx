"use client";
import { detailEventFetchDb } from "@/data/eventData"
import { getTicketByEventFetchDb } from "@/data/ticketsData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

const page = ({ params }: { params: { eventId: string }}) => {
  const router = useRouter()
  const { eventId } = params
  const [event, setEvent] = useState<any>({})
  const [tickets, setTickets] = useState<any>([])
  const [startDate, setStartDate] = useState<any>("")
  const [endDate, setEndDate] = useState<any>("")

  useEffect(() => {
    getEvent()
    getTickets()
  }, [])

  const getEvent = async () => {
    const { result, ok } = await detailEventFetchDb(eventId);
    try {
      if (!ok) throw result.message
      setEvent(result.data)
      setStartDate(new Date(result.data.start_date).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta',
        weekday: 'long',   // Nama hari
        year: 'numeric',   // Tahun
        month: 'long',     // Nama bulan
        day: 'numeric',    // Tanggal
        hour: 'numeric',   // Jam
        minute: 'numeric', // Menit
       }))
      setEndDate(new Date(result.data.end_date).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
       }))
    } catch (error) {
      console.log(error as string)
    }
  }

  const getTickets = async () => {
    const { result, ok } = await getTicketByEventFetchDb(eventId);
    try {
      if(!ok) throw result.message
      console.log(result.data)
      setTickets(result.data)
    } catch (error) {
      console.log(error as string)
    }
  }

  return (
    <main className="flex flex-col justify-center items-center">

      <div className="my-6">
      <h2 className="font-bold text-5xl text-neutral-800 dark:text-neutral-200">
        Detail<span className="text-blue-800 font-extrabold"> Event</span>
      </h2>
      </div>

      <div className="w-[90%] md:w-[80%] rounded-lg  p-5 border border-neutral-200">
        <div className='flex justify-center items-center p-2 rounded-t-3xl overflow-hidden'>
          <img src={event.event_pic} alt={event.title} className='rounded-3xl object-cover aspect-video h-full w-full '/>
        </div>

        <div className="mt-4">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl md:text-5xl font-bold text-white">{event.title}</h1>
          </div>
          <div className="my-3 p-3">
            <h2 className="text-neutral-200 text-xl tracking-wider break-words whitespace-normal">{event.description}</h2>
          </div>
          <div className="my-5 md:my-10 flex flex-col md:flex-row justify-between items-center">
            <div className="text-neutral-200 text-lg tracking-wider">
              <h3>Location : {event.location}</h3>
              <h3>Start Event : {startDate}</h3>
              <h3>Closed Event : {endDate}</h3>
            </div>
            <div>
              <h1 className="text-3xl font-bold uppercase text-blue-800 md:-rotate-45 mt-3 md:mt-0 tracking-wider">{event.category}</h1>
            </div>
          </div>
        </div>
      </div>
      {/* card ticket */}
      <div className="w-full flex flex-col gap-4 justify-center items-center mt-10">

        {tickets.map((ticket: any, index: number) => (
          <div key={index} className={`border
            ${ticket.roleTicket === "reguler" ? "border-blue-800" : ""}
            ${ticket.roleTicket === "vip" ? "border-yellow-500" : ""}
            ${ticket.roleTicket === "super-vip" ? "border-red-700" : ""}
            w-[90%] md:w-[80%] h-[150px] rounded-xl flex flex-col md:flex-row justify-around items-center overflow-hidden`}>
            
          <div style={{ backgroundImage: `url(${event.event_pic})` }} className={`bg-cover bg-center w-full h-full rounded-xl`}>
            <div className="w-full h-full bg-black bg-opacity-70 flex  justify-between items-center px-4">
              <div className="flex justify-between items-center flex-col">
                <div className="flex flex-col justify-between items-start">
                  <div>
                    <h2 className="text-white font-semibold text-lg md:text-2xl tracking-wider truncate">{event.title}</h2>
                    <p className="text-neutral-200 font-semibold text-sm md:text-lg truncate">Quantity : {ticket.quantity}</p>
                    <h2 className={`
                      ${ticket.roleTicket === "reguler" ? "text-blue-800" : ""}
                      ${ticket.roleTicket === "vip" ? "text-yellow-500" : ""}
                      ${ticket.roleTicket === "super-vip" ? "text-red-700" : ""}
                      font-bold text-xl uppercase tracking-wider`}>{ticket.roleTicket}</h2>
                  </div>
                  <p className="text-white font-semibold text-sm md:text-lg">{ticket.price}</p>
                </div>
              </div>
              
              <div onClick={() => router.push(`/transaction/${eventId}/${ticket.id}`)} className={`${ticket.quantity === 0 ? "hidden" : ""}
                flex justify-center items-end`}>
                <div className="button rounded-full text-lg md:text-xl font-bold px-4 py-1 before:bg-blue-800 text-white cursor-pointer duration-300 hover:scale-95">
                  BUY
                </div>
              </div>
            </div>
          </div>

      </div>
        ))}

      </div>
    </main>
  )
}

export default page