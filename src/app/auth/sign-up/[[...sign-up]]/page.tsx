"use client";
import { SignUp, useAuth } from "@clerk/nextjs";

const Page = () => {
  const { isLoaded } = useAuth();
  if (!isLoaded) return null;
  return <SignUp />;
};

export default Page;
