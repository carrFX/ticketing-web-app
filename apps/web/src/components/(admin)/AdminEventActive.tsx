"use client";
import { getEventsActive } from "@/data/eventData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface IEvents {
  id: number
  title: string
  event_pic: string
  description: string
  start_date: string
  end_date: string
  location: string
  category: string
}

const AdminEventActive = () => {
    const router = useRouter()
    const [events, setEvents]: [IEvents[], any] = useState([])

    useEffect(() => {
      dataEvents();
    },[])

  const dataEvents = async () => {
      const { result, ok } = await getEventsActive();
      try {
      if (!ok) throw result;
      setEvents(result.data.map((event: any, index: number) => ({ ...event, no: index + 1 })))
      console.log(result.data)
      } catch (error) {
      console.log(error);
      }
  }

  const detailEvent = (id: any) => {
    router.push(`/events/${id}`)
  }
  return (
    <div className="flex flex-col justify-center items-center">
        <div className="w-full flex justify-center items-center my-6">
          <h1 className="text-neutral-200 text-3xl font-bold">Your <span className="text-blue-800">Event</span></h1>
        </div>
        <div className="w90% md:w-[80%]">
            {events.map((event) => (
                <div onClick={() => detailEvent(event.id)} className="hover:scale-105 hover:bg-blue-800 duration-300 cursor-pointer group px-4 py-2 border border-blue-800 rounded-full flex justify-start items-center gap-2 my-4">
                  <div className='flex justify-center items-center rounded'>
                    <img src={event.event_pic} alt={event.title} className='rounded-full object-cover aspect-video md:h-[100px] md:w-[170px] h-[50px] w-[100px]'/>
                  </div>
                  <div className="h-full w-2/3 flex flex-col justify-center items-center">
                    <div className="w-2/3 text-center">
                        <h1 className="text-2xl text-center font-bold tracking-wider group-hover:text-white duration-300 text-neutral-200">{event.title}</h1>
                    </div>
                    <div className="w-2/3 text-center">
                        <p className="text-lg text-center text-neutral-300 group-hover:text-white duration-300 tracking-wider truncate">{event.description}</p>
                    </div>
                  </div>
                  <div className="px-4">
                    <h1 className="text-xl uppercase font-bold text-blue-800 tracking-wider group-hover:text-red-700 duration-300 -rotate-45">{event.category}</h1>
                  </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default AdminEventActive