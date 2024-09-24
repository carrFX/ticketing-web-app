import { CreateTicketsComp } from "@/components/(admin)/CreateTickets"

const page = () => {
  return (
    <main>
      <div className="flex flex-col justify-center items-center text-center">
      <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
        Create <span className="text-blue-800 font-extrabold">Tickets</span>
      </h2>
      <p className="text-sm max-w-lg mt-2 text-neutral-300 mb-9">
        Easily create a new ticket for your event. Fill in the ticket details and start selling tickets now ! <span className="font-bold">Note: please do not leave this page, This ticket automatically follows the event you just created.</span>
      </p>
      </div>
      <CreateTicketsComp/>
    </main>
  )
}

export default page