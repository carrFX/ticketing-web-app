"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IRegisterUser } from "@/type/authType";
import { registerFetchDb } from "@/data/authData";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { toast } from "react-toastify";
import { registerSchema } from "@/yupSchema/authSchema";

export function RegisterComp() {
    const router = useRouter();
    const handlerDataRegister = async (
        data: IRegisterUser,
        action: FormikHelpers<IRegisterUser>,
    ) => {
        const { result, ok } = await registerFetchDb(data);
        try {
        if (!ok) throw result.message;
        toast.success(result.message);
        action.resetForm();
        router.push('/login'); 
        } catch (error) {
        toast.error(error as string);
        }
    };
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to ticke<span className="text-blue-800 font-extrabold">THING.</span>
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300 mb-9">
        We&apos;re excited to have you! Create your account and dive into the experience.
      </p>
      
      <Formik<IRegisterUser> // tipe data val keluaran
        initialValues={{
          username: '',
          email: '',
          password: '',
          role: 'buyer',
          referralBy: '',
        }}
        validationSchema={registerSchema}
        onSubmit={(val, action) => {
          handlerDataRegister(val, action);
        }}
      >
        {({ handleSubmit, values, handleChange }) => {
            return (
                <Form>
                    {/* username */}
                    <LabelInputContainer className="mb-4">
                    <Label htmlFor="username">Username</Label>
                    <Input value={values.username} onChange={handleChange} name="username" id="username" placeholder="Tyler Durden" type="text" />
                    <ErrorMessage name="username" component="div" className="text-[12px] text-red-500"/>
                    </LabelInputContainer>
                    {/* email */}
                    <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input value={values.email} onChange={handleChange} name="email" id="email" placeholder="projectmayhem@fc.com" type="email"/>
                    <ErrorMessage name="email" component="div" className="text-[12px] text-red-500"/>
                    </LabelInputContainer>
                    {/* password */}
                    <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input onChange={handleChange} name="password" id="password" placeholder="••••••••" type="password" value={values.password}/>
                    <ErrorMessage name="password" component="div" className="text-[12px] text-red-500"/>
                    </LabelInputContainer>
                    {/* referral */}
                    <LabelInputContainer className="">
                    <Label htmlFor="referralBy">Referral Code</Label>
                    <Input onChange={handleChange} value={values.referralBy} name="referralBy" id="referralBy" placeholder="eXaMpLe" type="password" />
                    <ErrorMessage name="password" component="div" className="text-[12px] text-red-500"/>
                    </LabelInputContainer><br/>
                    {/* account role */}
                    <LabelInputContainer className="mb-5 flex justify-center items-center">
                    <Label htmlFor="role">Account Type</Label>
                    <div className="flex justify-start items-center gap-4 px-3">
                        <div><Field id="role" name="role" type="radio" value={"buyer"} onChange={handleChange} checked/>Buyer</div>
                        <div><Field id="role" name="role" type="radio" onChange={handleChange} value={"seller"}/>Seller</div>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-[12px] text-red-500"/>
                    </LabelInputContainer>

                    

                    <button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                    >
                    Sign Up &rarr;
                    <BottomGradient />
                    </button>
                </Form>
            )
        }}
      </Formik>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex justify-center items-center space-y-4">
            <p>Already have an account ? <Link href={'/login'} className="text-blue-800">Login</Link></p>
        </div>
    </div>
  );
}

export const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

export const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
