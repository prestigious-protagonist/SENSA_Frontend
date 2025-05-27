"use client";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Check, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { setUserIDs } from "@/features/checkNotiSlice";
import Image from "next/image";
import { toast } from "sonner";
import { setConnectionCount } from "@/features/connectionSlice";
import { CustomLoader } from "../components/customLoader";

const Page = () => {
  const dispatch = useDispatch();
  const { getToken, isLoaded } = useAuth();
  const [isReviewing, setIsReviewing] = useState(false);
  const connection = useSelector((state: any) => state.connections);
  const notification = useSelector((state: any) => state.notification);

  async function handleInvite(status: string, id: string) {
    setIsReviewing(true);
    if (status === "accepted") {
      status = "accepted";
    } else {
      status = "rejected";
    }
    try {
      const token = await getToken();
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/userService/api/v1/request/review/${status}/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.status === 200) {
        if (result.data.data.request.status === "rejected") {
          console.log(result.data.data.request.receiverId);
          dispatch(
            setUserIDs({
              userIDs: [
                ...notification.userIDs,
                result.data.data.request.receiverId,
              ],
            })
          );
        }
        if (result.data.data.request.status === "accepted") {
          dispatch(
            setConnectionCount({
              connectionCount: connection.connectionCount + 1,
            })
          );
        }
        toast.success("Notification updated successfully", {
          description: result.data.data.message,
        });
      } else {
        toast.error("Something went wrong", {
          description: result.data.data.message,
        });
      }
    } catch (error: unknown) {
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
      setIsReviewing(false);
    }
  }

  if (!isLoaded) return <CustomLoader />;

  return (
    <div className="space-y-8 h-full [&_strong]:font-semibold [&_strong]:text-foreground relative">
      {notification.notificationCount === 0 ? (
        <h4 className="text-center font-medium text-black text-xl absolute left-1/2 -translate-x-1/2 top-1/2">
          No new notifications
        </h4>
      ) : (
        notification.notifications.map((notification: any, index: number) => (
          <div className="space-y-1" key={index}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={notification.senderInfo.profilePicture}
                    width={100}
                    height={100}
                    alt="Notifications"
                  />
                </div>
                <div className="-space-y-1.5">
                  <p className="text-lg font-medium">
                    {notification.senderInfo.username}
                  </p>
                  <p className="text-lg">{notification.senderInfo.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isReviewing}
                  onClick={() => handleInvite("accepted", notification._id)}
                  className="w-10 rounded-full h-10 bg-green-400 flex justify-center items-center text-white hover:bg-green-500 hover:text-white"
                >
                  <Check />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isReviewing}
                  onClick={() => handleInvite("rejected", notification._id)}
                  className="w-10 rounded-full h-10 bg-red-400 flex justify-center items-center text-white hover:bg-red-500 hover:text-white"
                >
                  <X />
                </Button>
              </div>
            </div>
            <p className="mt-2 text-base">{notification.senderInfo.bio}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Page;
