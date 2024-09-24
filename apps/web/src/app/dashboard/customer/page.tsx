import CustomerPage from "@/components/(admin)/CustomerPage"

const page = () => {
  return (
    <main>
        <div className="flex justify-center items-center">
          <h1 className='text-3xl font-bold tracking-wide'>CUSTOMER</h1>
        </div>
        <div>
          <CustomerPage/>
        </div>
    </main>
  )
}

export default page