"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ErrorMessage, Form, Formik, FormikHelpers } from 'formik';
import { toast } from "react-toastify";
import { loginFetchDb } from "@/data/authData";
import { ILoginUser } from "@/type/authType";
import { loginSchema } from "@/yupSchema/authSchema";
import { BottomGradient, LabelInputContainer } from "./RegisterComp";

export function LoginComp() {
    const router = useRouter();
    const handleDataLogin = async (
        data: ILoginUser,
        action: FormikHelpers<ILoginUser>,
    ) => {
        const { result, ok } = await loginFetchDb(data);
        try {
        if (!ok) throw result.message;
        toast.success(result.message);
        action.resetForm();
        router.push('/');
        router.refresh();
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
        Access your account for a more personalized experience.
      </p>

      <Formik<ILoginUser> // tipe data val keluaran
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={loginSchema}
        onSubmit={(val, action) => {
          handleDataLogin(val, action);
        }}
      >
        {({ handleSubmit, values, handleChange }) => {
            return (
                <Form>
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

                    <button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                    >
                    Sign In &rarr;
                    <BottomGradient />
                    </button>
                </Form>
            )
        }}
      </Formik>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex justify-center items-center space-y-4">
            <p>Don't have an account ? <Link href={'/register'} className="text-blue-800">Register</Link></p>
        </div>
    </div>
  );
}
