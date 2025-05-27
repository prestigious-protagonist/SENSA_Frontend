"use client";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { EditProfileForm } from "./components/EditProfileForm";
import FormSkeleton from "@/components/ui/skeletons/formSkeleton";
import { CreateProfileForm } from "./components/CreateProfileForm";

const Page = () => {
  const { getToken, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isNewAccount, setIsNewAccount] = useState(true);
  const [existingUser, setExistingUser] = useState(null);

  async function checkIfNewAccount() {
    try {
      const token = await getToken();
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/userService/api/v1/myProfile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExistingUser(result.data.data);
      if (result.status === 202) setIsNewAccount(false);
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isLoaded) {
      checkIfNewAccount();
    }
  }, [isLoaded]);

  if (!isLoaded || isLoading) return <FormSkeleton />;

  return isNewAccount ? (
    <CreateProfileForm />
  ) : (
    <EditProfileForm existingUser={existingUser ?? undefined} />
  );
};

export default Page;
