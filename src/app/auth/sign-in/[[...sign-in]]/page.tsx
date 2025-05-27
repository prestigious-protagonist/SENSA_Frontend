"use client";
import { SignIn, useAuth } from "@clerk/nextjs";

const Page = () => {
  const { isLoaded } = useAuth();
  if (!isLoaded) return null;
  return <SignIn />;
};

export default Page;
