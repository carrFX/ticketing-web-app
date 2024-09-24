"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { toast } from "react-toastify";
import { BottomGradient, LabelInputContainer } from "../(auth)/RegisterComp";
import { ICreateTicket } from "@/type/eventType";
import { createTicketsFetchDb } from "@/data/ticketsData";
import { createTicketsSchema } from "@/yupSchema/eventSchema";

export function CreateTicketsComp() {
    const router = useRouter();
    const handlerDataEvent = async (data: ICreateTicket, action: FormikHelpers<ICreateTicket>,) => {
      const intPrice = Number(data.price);
      const intQuantity = Number(data.quantity);
      const newData = {
        roleTicket : data.roleTicket,
        price : intPrice,
        quantity : intQuantity
      }
  
      const { result, ok } = await createTicketsFetchDb(newData);
      try {
        if (!ok) throw result.message;
        toast.success(result.message);
        action.resetForm();
        router.push('/create-event/create-ticket/success-create');
      } catch (error) {
        toast.error(error as string);
      }
    }
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <Formik<ICreateTicket> // tipe data val keluaran
        initialValues={{
          roleTicket : "reguler",
          price : "",
          quantity : "",
        }}
        validationSchema={createTicketsSchema}
        onSubmit={(val, action) => {
          handlerDataEvent(val, action);
        }}
      >
        {({  handleSubmit, values, handleChange, isSubmitting }) => {
            return (
                <Form onSubmit={handleSubmit} action="">
                    {/* price */}
                    <LabelInputContainer className="mb-4">
                    <Label htmlFor="price">Ticket Price</Label>
                    <Input value={values.price} onChange={handleChange} name="price" id="price" placeholder="must be number.." type="text"/>
                    <ErrorMessage name="price" component="div" className="text-[12px] text-red-500"/>
                    </LabelInputContainer>
                    {/* quantity */}
                    <LabelInputContainer className="mb-4">
                    <Label htmlFor="quantity">Quantity Ticket</Label>
                    <Input onChange={handleChange} name="quantity" id="quantity" placeholder="must be number..." type="text" value={values.quantity}/>
                    <ErrorMessage name="quantity" component="div" className="text-[12px] text-red-500"/>
                    </LabelInputContainer>
                    {/* role ticket */}
                    <LabelInputContainer className="mb-4">
                      <Label htmlFor="roleTicket">Category</Label>
                      <Field as="select" name="roleTicket" id="roleTicket" className="flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm  file:border-0 file:bg-transparent 
                        file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
                        focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
                        disabled:cursor-not-allowed disabled:opacity-50
                        dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
                        group-hover/input:shadow-none transition duration-400">
                          <option value="reguler" className="rounded-full">REGULER</option>
                          <option value="vip" className="rounded-full">VIP</option>
                          <option value="super-vip" className="rounded-full">SUPER VIP</option>
                      </Field>
                      <ErrorMessage name="category" component="div" className="text-[12px] text-red-500"/>
                      </LabelInputContainer>

                    <button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit" disabled={isSubmitting}
                    >
                    {isSubmitting ? "Creating..." : "Next "} &rarr;
                    <BottomGradient />
                    </button>
                </Form>
            )
        }}
      </Formik>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
    </div>
  );
}
