"use client";

import React, { useEffect, useState } from "react";
import { ChatApp } from "../components/chatApp";
import { useAuth } from "@clerk/nextjs";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const Page = () => {
  const { getToken } = useAuth();
  const searchParams = useSearchParams();
  const user = useSelector((state: any) => state.user);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const currentUserId = user.userId;
  const otherUserId = searchParams.get("otherUserId");
  const otherUserAvatar = searchParams.get("otherUserAvatar");

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      setAuthToken(token);
    };
    fetchToken();
  }, [getToken]);

  if (!otherUserId)
    return (
      <div className="w-full h-full flex flex-col space-y-6 justify-center items-center">
        <h1 className="text-4xl font-medium">Nothing to see here...</h1>
        <span className="text-2xl font-normal">
          Please{" "}
          <Link
            href="/feed/my-connections"
            className="text-[#9170FF] font-medium"
          >
            visit your connections
          </Link>{" "}
          or{" "}
          <Link href="/feed" className="text-[#9170FF] font-medium">
            create a new one
          </Link>
        </span>
      </div>
    );

  return (
    <ChatApp
      otherUserAvatar={otherUserAvatar || ""}
      currentUserId={currentUserId}
      otherUserId={otherUserId || ""}
      authToken={authToken || ""}
    />
  );
};

export default Page;
