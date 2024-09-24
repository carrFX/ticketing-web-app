"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from "react-toastify";
import { createEventsSchema } from "@/yupSchema/eventSchema";
import { createEventsFetchDb } from "@/data/eventData";
import { FileUpload } from "../ui/file-upload";
import { BottomGradient, LabelInputContainer } from "../(auth)/RegisterComp";

export function CreateEvents() {
    const router = useRouter();
    const [filesImg, setFilesImg] = useState<File[]>([]);
    const handleFileUpload = (files: File[]) => {
      setFilesImg(files);
    };
  return (
    <div className="flex flex-col items-center justify-center">
    <div className="flex flex-col justify-center items-center max-w-lg my-6">
      <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
        Create<span className="text-blue-800 font-extrabold"> EVENTS</span>
      </h2>
      <p className="text-neutral-600 text-md mt-2 text-center dark:text-neutral-300 mb-9">
      Thank you for creating an event on our platform! Fill in your event details, and we&apos;ll help you manage it easily. Wishing you a successful event!
      </p>
    </div>
      <Formik
        initialValues={{
          title: "",
          category: "",
          description: "",
          start_date: "",
          end_date: "",
          location: ""
        }}
        validationSchema={createEventsSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const formData = new FormData();
          formData.append("title", values.title);
          formData.append("description", values.description);
          formData.append("start_date", new Date(values.start_date).toISOString());
          formData.append("end_date", new Date(values.end_date).toISOString());
          formData.append("category", values.category);
          formData.append("location", values.location);
          formData.append("pict", filesImg[0]);

          
          try {
            const { result, ok } = await createEventsFetchDb(formData);
            if (!ok) throw new Error(result.message);
            toast.success("Event created successfully!");
            router.push("/create-event/create-ticket");
          } catch (error) {
            toast.error(`Failed to create event: ${(error as Error).message}`);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values }) => {
            return (
                <Form className="flex flex-col justify-center items-center">
                    <div className="md:flex md:flex-row md:justify-center md:items-start md:gap-10">
                    <div className="md:w-[50%]">
                      {/* title */}
                      <LabelInputContainer className="mb-4">
                      <Label htmlFor="title">Title events</Label>
                      <Input name="title" onChange={(e) => values.title = e.target.value} id="title" placeholder="Write your events Here.." type="text" />
                      <ErrorMessage name="title" component="div" className="text-[12px] text-red-500"/>
                      </LabelInputContainer>

                      {/* location */}
                      <LabelInputContainer className="mb-4">
                      <Label htmlFor="location">Location</Label>
                      <Input name="location" onChange={(e) => values.location = e.target.value} id="location" placeholder="Write location events Here.." type="text" />
                      <ErrorMessage name="location" component="div" className="text-[12px] text-red-500"/>
                      </LabelInputContainer>

                      {/* category */}
                      <LabelInputContainer className="mb-4">
                      <Label htmlFor="category">Category</Label>
                      <Field as="select" name="category" id="category" className="flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm  file:border-0 file:bg-transparent 
                        file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
                        focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
                        disabled:cursor-not-allowed disabled:opacity-50
                        dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
                        group-hover/input:shadow-none transition duration-400">
                           <option value="" className="rounded-full">Select a event category</option>
                          <option value="sport" className="rounded-full">Sport</option>
                          <option value="tour" className="rounded-full">Tour</option>
                          <option value="music" className="rounded-full">Music</option>
                          <option value="movie" className="rounded-full">Movie</option>
                          <option value="other" className="rounded-full">Other...</option>
                      </Field>
                      <ErrorMessage name="category" component="div" className="text-[12px] text-red-500"/>
                      </LabelInputContainer>
                      
                      <div className="flex justify-between items-center mb-3">
                        {/* start_date */}
                      <LabelInputContainer className="w-[48%]">
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input name="start_date" onChange={(e) => values.start_date = e.target.value} id="start_date" type="datetime-local"/>
                      <ErrorMessage name="start_date" component="div" className="text-[12px] text-red-500"/>
                      </LabelInputContainer>
                      {/* end_date */}
                      <LabelInputContainer className="w-[48%]">
                      <Label htmlFor="end_date">End Date</Label>
                      <Input name="end_date" onChange={(e) => values.end_date = e.target.value}  id="end_date" type="datetime-local"/>
                      <ErrorMessage name="end_date" component="div" className="text-[12px] text-red-500"/>
                      </LabelInputContainer>
                      </div>

                      {/* description */}
                      <LabelInputContainer className="">
                      <Label htmlFor="description">Description</Label>
                      <textarea name="description" onChange={(e) => values.description = e.target.value} id="description" rows={5} placeholder="Event description.." className="flex h-30 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-400"/>
                      <ErrorMessage name="description" component="div" className="text-[12px] text-red-500"/>
                      </LabelInputContainer>
                    </div>

                    <div className="md:w-[50%]">
                      {/* file image */}
                      <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
                        <FileUpload onChange={handleFileUpload}/>
                      </div>
                    </div>

                    </div>
                    <button
                    className="md:w-[50%] md:mt-14 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit" disabled={isSubmitting}
                    >
                    {isSubmitting ? "Creating..." : "Next"} &rarr;
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
