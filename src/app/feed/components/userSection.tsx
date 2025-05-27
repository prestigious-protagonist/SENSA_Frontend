import axios from "axios";
import { UserCard } from "./userCard";
import { useAuth } from "@clerk/nextjs";
import { useDispatch } from "react-redux";
import { UserActions } from "./userActions";
import { useEffect, useState } from "react";
import { CustomLoader } from "./customLoader";
import { setUserData } from "@/features/userSlice";

export const UserSection = () => {
  const dispatch = useDispatch();
  const { getToken, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isNewAccount, setIsNewAccount] = useState(true);

  async function getUserData(): Promise<boolean> {
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
        dispatch(
          setUserData({
            userId: result.data.data.id,
            skills: result.data.data.Skills,
            biography: result.data.data.bio,
            username: result.data.data.username,
            interests: result.data.data.InterestedIns,
            githubProfile: result.data.data.social?.github,
            linkedInProfile: result.data.data.social?.linkedIn,
          })
        );
        setIsNewAccount(false);
        return false;
      }
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
    return true;
  }

  useEffect(() => {
    if (isLoaded) {
      getUserData();
    }
  }, [isLoaded]);

  if (!isLoaded || isLoading) return <CustomLoader />;

  return (
    <main className="space-y-6">
      <UserCard />
      <UserActions />
    </main>
  );
};
