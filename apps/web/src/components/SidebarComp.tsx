"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { MdSpaceDashboard } from "react-icons/md";
import { LuLogIn } from "react-icons/lu";
import { IoCreateOutline } from "react-icons/io5";
import { GiTicket } from "react-icons/gi";
import {
  IconArrowLeft,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { logoutFetchDb } from "@/data/authData";
import { toast } from "react-toastify";
import { ProfileFetchDb } from "@/data/userData";

export function SidebarComp({children}: Readonly<{children: React.ReactNode}>) {
    const [isLogin, setIsLogin] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');
    
    useEffect(() => {
      userProfile()
    })
    const userProfile = async () => {
      const { result, ok } = await ProfileFetchDb();
      if(!ok) return
      if (ok) setIsLogin(true);
      if (result.data.role === "seller") {
        setIsSeller(true)
      } else {
        setIsSeller(false)
      }
      setUsername(result.data.username);
      setAvatar(result.data.avatar);
    }
    const userLoginNav = [
        {
        label: "Profile",
        href: "/profile",
        icon: (
            <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        )
        }
    ];
    const sellerNav = [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
            <MdSpaceDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        )
      },
      {
        label: "Create Event",
        href: "/create-event",
        icon: (
            <IoCreateOutline className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        )
      }
    ];
    const noUserNav = [
        {
        label: "Login",
        href: "/login",
        icon: (
            <LuLogIn className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        }
    ];

    const handleLogout = async () => {
      const {result, ok} = await logoutFetchDb()
      try {
        if(!ok) throw result.message
        toast.success(result.message)
        window.location.reload();
      } catch (error) {
        toast.error(error as string)
      }
    }

    const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-black w-screen flex-1 mx-auto border border-neutral-200 dark:border-none overflow-auto h-full",
        "h-dvh"
      )}
    >
      {isLogin ? (
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {userLoginNav.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
                {isSeller && sellerNav.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
                  <div onClick={handleLogout}>
                    <SidebarLink 
                    link={{
                      label: "Logout",
                      href: "#",
                      icon: (
                        <IconArrowLeft
                          className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
                        />
                      )}}
                    />
                  </div>
              </div>
            </div>
            <div>
            <SidebarLink
                link={{
                  label: `${username}`,
                  href: "/profile",
                  icon: (
                    <img
                      src={avatar}
                      className="h-7 w-7 flex-shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
              />
            </div>
        </SidebarBody>
      </Sidebar>
      )
      :
      (
        <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {noUserNav.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "you are not logged in yet",
                href: "/login",
                icon: (
                  <img
                    src="https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      )}
      <div className="overflow-y-auto w-full">
        {children}
      </div>
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <GiTicket className="h-8 w-8 text-blue-900 flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        <h1 className="text-xl">ticke<span className="text-blue-800  font-extrabold">THING.</span></h1>
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <GiTicket className="h-8 w-8 text-blue-900 flex-shrink-0" />
    </Link>
  );
};
