import AddTickets from "@/components/(admin)/AddTickets"

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex flex-col w-full justify-center items-center text-center">
            <h1 className="text-2xl text-white tracking-wide font-semibold">Do you want to add <span className="text-blue-800">another ticket?</span></h1>
            <p className="text-sm mt-2 text-neutral-300 tracking-wider">NOTE: After you press the NO button, you won't be able to add more tickets.</p>
        </div>
        <div>
            <AddTickets/>
        </div>
    </div>
  )
}

export default page