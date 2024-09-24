"use client";
import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "../ui/images-slider";
import heroimg from "@/data/hero.json";

export function HeroCarousel() {
  return (
    <ImagesSlider className="h-[50vh]" images={heroimg.heroImage}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="font-bold text-2xl md:text-4xl tracking-wider text-center bg-clip-text text-neutral-200 py-4">
          ticke<span className="text-blue-800">THING.</span> know your <span className="text-blue-800">THINK!</span>
        </motion.p>
      </motion.div>
    </ImagesSlider>
  );
}
