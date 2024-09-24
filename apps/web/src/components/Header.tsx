import Link from "next/link";
const Header = () => {
  return (
    <>
      <nav
        className={`sticky top-10 md:top-0 w-full bg-[#00000086] flex justify-center items-center backdrop-blur-sm  py-5  text-[#cbcbcb] px-6 z-[100]`}
      >
        <div className="">
          <Link
            href={"/"}
            className={`text-white font-extrabold cursor-pointer text-xl md:text-2xl`}
          >
            <p>ticke<span className="text-blue-800">THING.</span></p>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Header