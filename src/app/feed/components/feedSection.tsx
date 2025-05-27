"use client";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { Plus } from "lucide-react";
import { io } from "socket.io-client";
import { useAuth } from "@clerk/nextjs";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CustomLoader } from "./customLoader";
import { Button } from "@/components/ui/button";
import { setAllusers } from "@/features/allUsersSlice";
import { useDispatch, useSelector } from "react-redux";
import { setUserIDs, setNotificationCount } from "@/features/checkNotiSlice";

export const FeedSection = () => {
  const dispatch = useDispatch();
  const { getToken, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state: any) => state.user);
  const [sendingInvite, setSendingInvite] = useState(false);
  const allUsers = useSelector((state: any) => state.users.users);
  const notification = useSelector((state: any) => state.notification);

  useEffect(() => {
    const socket = io("http://3.110.117.104:3007", {
      query: {
        userId: user.userId,
      },
    });
    socket.on("connection-request", (data) => {
      dispatch(setUserIDs({ userIDs: data.from }));
      dispatch(
        setNotificationCount({
          notificationCount: notification.notificationCount + 1,
        })
      );
    });
    return () => {
      socket.disconnect();
    };
  }, [user?.userId, notification.notificationCount]);

  async function getAllAccounts() {
    setIsLoading(true);
    try {
      const token = await getToken();
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/userService/api/v1/request/feed`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.status === 200) {
        dispatch(setAllusers({ users: result.data.data.users }));
      }
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isLoaded) {
      getAllAccounts();
    }
  }, [isLoaded]);

  async function sendNotification(userId: string, username: string) {
    setSendingInvite(true);
    try {
      const token = await getToken();
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/userService/api/v1/request/send/interested/${userId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.status === 201) {
        dispatch(setUserIDs({ userIDs: [...notification.userIDs, userId] }));
        toast.success("Invitation sent successfully", {
          description: `Invitation sent to ${username}`,
        });
      } else {
        toast.error("Something went wrong", {
          description: result.data.message,
        });
      }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "Something went wrong";
        const errorData = error.response?.data?.data;
        toast.error(errorMessage, {
          description: errorData || error.message,
        });
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setSendingInvite(false);
    }
  }

  if (!isLoaded || isLoading) return <CustomLoader />;

  return (
    <div className="w-full grid grid-cols-2 gap-10">
      {allUsers
        .filter((user: any) => !notification.userIDs?.includes(user.id))
        .map((user: any, index: number) => (
          <div
            key={index}
            className="bg-[#F4F2EE] relative overflow-hidden min-h-60 rounded-3xl w-full shadow-xl flex flex-col justify-between p-4 bg-cover"
          >
            <div
              className="absolute top-0 left-0 w-full h-20"
              style={{
                backgroundImage: `url(https://avatar.vercel.sh/${user.fullname
                  ?.replace(/\s+/g, "")
                  .toLowerCase()})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute top-0 left-0 w-full h-20 bg-black/10 z-10" />
            <div className="flex flex-row items-center space-x-4 z-10">
              <Image
                height={100}
                width={100}
                alt="user-image"
                src={`${user.profilePicture}`}
                className="h-10 w-10 rounded-full border-2 object-cover"
              />
              <div className="flex flex-col">
                <p className="font-normal text-base text-gray-50 relative">
                  {user.fullname}
                </p>
                <p className="text-sm text-gray-100">{user.email}</p>
              </div>
            </div>
            <div className="text content mt-8">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-lg md:text-xl relative">
                  {user.username}
                </h1>
                <h3 className="text-sm">{user.gender}</h3>
                <h3 className="text-sm -ml-1">{user.age}</h3>
              </div>
              <p className="font-normal text-sm relative mt-1">{user.bio}</p>
            </div>
            <div className="flex flex-col mt-4">
              <div>
                <p className="font-medium text-sm relative mb-0.5">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {user.Skills.map((skill: any, index: number) => (
                    <Badge key={index} className="text-sm">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <div>
                  <p className="font-medium text-sm relative mb-0.5">
                    Interests
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {user.InterestedIns.map((interests: any, index: number) => (
                      <Badge key={index} className="text-sm">
                        {interests.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between mt-4 pb-2">
              <div className="flex flex-col gap-0.5">
                <p className="font-medium text-sm relative mb-0.5">Socials</p>
                <div className="flex items-center gap-3">
                  <Link href={`${user.social.github}`} target="_blank">
                    <Image
                      src="https://img.clerk.com/static/github.svg?width=160"
                      alt="github"
                      width={27}
                      height={27}
                    />
                  </Link>
                  <Link href={`${user.social.linkedIn}`} target="_blank">
                    <Image
                      src="https://img.clerk.com/static/linkedin.svg?width=160"
                      alt="github"
                      width={27}
                      height={27}
                    />
                  </Link>
                </div>
              </div>
              <div></div>
              <Button
                variant="secondary"
                disabled={sendingInvite}
                className="cursor-pointer group"
                onClick={() => sendNotification(user.id, user.username)}
              >
                Invite to connect{" "}
                {sendingInvite ? (
                  <Plus className="animate-spin" />
                ) : (
                  <Plus className="transition-transform group-hover:rotate-90" />
                )}
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
};
