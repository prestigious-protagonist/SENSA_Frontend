"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSession } from "@clerk/nextjs";
import { CustomLoader } from "./customLoader";

export const UserCard = () => {
  const { session, isLoaded } = useSession();
  const user = useSelector((state: any) => state.user);

  if (!isLoaded || !session?.user) return <CustomLoader />;

  return (
    <div className="p-4 rounded-3xl shadow-md bg-[#F4F2EE] relative overflow-hidden space-y-6">
      <div
        className="absolute top-0 left-0 w-full h-20 z-0"
        style={{
          backgroundImage: `url(https://avatar.vercel.sh/${session.user.fullName
            ?.replace(/\s+/g, "")
            .toLowerCase()})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute top-0 left-0 w-full h-20 bg-black/10 z-10" />
      <div className="flex flex-row items-center space-x-2 relative z-20">
        <Image
          height={100}
          width={100}
          alt="user-image"
          src={session.user.imageUrl}
          className="h-10 w-10 rounded-full border-2 object-cover"
        />
        <div className="flex flex-col">
          <p className="font-normal text-base text-gray-50">
            {session.user.fullName}
          </p>
          <p className="text-sm text-gray-50">
            {session.user.emailAddresses[0].emailAddress}
          </p>
        </div>
      </div>
      <div className="text content mt-8 relative z-20">
        <h1 className="font-semibold text-lg md:text-xl">{user.username}</h1>
        <p className="font-normal text-sm mt-2">{user.biography}</p>
      </div>
    </div>
  );
};
