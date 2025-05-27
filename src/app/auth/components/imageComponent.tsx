"use client";
import Spline from "@splinetool/react-spline";
import { memo } from "react";

export const ImageComponent = memo(() => {
  return (
    <div className="relative w-3/5 h-auto md:block hidden overflow-hidden">
      <Spline
        scene="https://prod.spline.design/dAsGvwsAyCnUggtj/scene.splinecode"
        className="scale-[1.2] w-full h-full"
      />
      <div className="absolute inset-0 bg-black/50 z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 z-20 w-[90%] md:w-4/5 max-w-3xl text-center px-4">
        <h1 className="text-white text-lg md:text-2xl lg:text-3xl font-medium leading-relaxed tracking-wide drop-shadow-lg">
          &quot;Technology is nothing. What&apos;s important is that you have
          faith in people, that they&apos;re basically good and smart, and if
          you give them tools, they&apos;ll do wonderful things with them.&quot;
          <br />
          <span className="block mt-4 text-sm md:text-base font-light text-gray-200">
            — Steve Jobs
          </span>
        </h1>
      </div>
    </div>
  );
});
