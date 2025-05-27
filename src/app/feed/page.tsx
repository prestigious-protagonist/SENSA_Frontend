"use client";

import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { FeedSection } from "./components/feedSection";
import { CustomLoader } from "./components/customLoader";

const Page = () => {
  const router = useRouter();
  const { getToken, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  // use null to indicate "not checked yet"
  const [isNewAccount, setIsNewAccount] = useState<boolean | null>(null);

  async function checkIfNewAccount(): Promise<boolean> {
    setIsLoading(true);
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
      if (result.status === 202) {
        setIsNewAccount(false); // existing user
        return false;
      }
      // If status not 202, treat as new account
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
    setIsNewAccount(true); // new user by default
    return true;
  }

  useEffect(() => {
    const handleCheck = async () => {
      const isNew = await checkIfNewAccount();
      if (isNew) {
        toast.info("Complete your profile!", {
          description: "Please complete your profile in order to continue",
        });
        router.push("/profile");
      }
    };
    if (isLoaded && isNewAccount === null) {
      handleCheck();
    }
  }, [isLoaded, isNewAccount]);

  // Show loader while auth or check in progress
  if (!isLoaded || isLoading || isNewAccount === null) return <CustomLoader />;

  // If user is new, the redirect will happen, so here we just render
  // existing user feed
  return (
    <Suspense fallback={<CustomLoader />}>
      <FeedSection />
    </Suspense>
  );
};

export default Page;
