"use client"

import Link from "next/link"

const DashboardCard = () => {
    const card = [
        {id:"1",title:"SALES",detail:"/dashboard/sales"},
        {id:"2",title:"EVENT ACTIVE",detail:"/dashboard/admin-events"},
        {id:"3",title:"CUSTOMER",detail:"/dashboard/customer"}
    ]
  return (
    <div className="flex w-full flex-col sm:flex-row justify-center items-center gap-4 mx-4">
        {card.map((item) => (
            <Link key={item.id} href={item.detail} className="cursor-pointer">
                <div className="w-[300px] h-[150px] border border-blue-800 text-white rounded-lg">
                    <div className="w-full h-full bg-black rounded-lg shadow-md p-6 flex flex-col items-center">
                        <h2 className="text-lg font-bold mb-2">{item.title}</h2>
                    </div>
                </div>
            </Link>
        ))}
    </div>
  )
}

export default DashboardCard