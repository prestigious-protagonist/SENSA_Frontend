"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Bookmark, Cloud, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import {
  setNotificationCount,
  setNotifications,
} from "@/features/checkNotiSlice";
import { useAuth } from "@clerk/nextjs";
import { CustomLoader } from "./customLoader";
import { setConnectionCount, setConnections } from "@/features/connectionSlice";

export const UserActions = () => {
  const dispatch = useDispatch();
  const { getToken, isLoaded } = useAuth();
  const connection = useSelector((state: any) => state.connections);
  const notification = useSelector((state: any) => state.notification);
  const [fetchingConnections, setFetchingConnections] = useState(false);
  const [fetchingNotifications, setFetchingNotifications] = useState(false);

  async function seeNotifications() {
    setFetchingNotifications(true);
    try {
      const token = await getToken();
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/userService/api/v1/request/received`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (result.status === 201) {
        dispatch(
          setNotificationCount({
            notificationCount: result.data.data.requests.length,
          })
        );
        dispatch(
          setNotifications({ notifications: result.data.data.requests })
        );
      } else {
        toast.error("Something went wrong", {
          description: result.data.data.message,
        });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.data.message || "Something went wrong";
        const errorData = error.response?.data?.data;
        toast.error(errorMessage, {
          description: errorData || error.message,
        });
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setFetchingNotifications(false);
    }
  }

  async function viewConnections() {
    setFetchingConnections(true);
    try {
      const token = await getToken();
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/userService/api/v1/request/viewConnections`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (result.status === 200 && result.data.success === true) {
        dispatch(
          setConnectionCount({
            connectionCount: result.data.data.length,
          })
        );
        dispatch(setConnections({ connections: result.data.data }));
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
      setFetchingConnections(false);
    }
  }

  useEffect(() => {
    if (isLoaded) {
      seeNotifications();
      viewConnections();
    }
  }, [isLoaded, notification.notificationCount, connection.connectionCount]);

  if (!isLoaded) return <CustomLoader />;

  return (
    <div className="py-4 rounded-3xl shadow-md bg-[#F4F2EE] relative overflow-hidden space-y-2">
      <Link
        href="/feed/my-connections"
        className="cursor-pointer text-sm font-semibold flex items-center px-4 gap-2"
      >
        <Flame size={16} className="font-semibold" />
        Connections:
        <span className="text-[#9170FF]">{connection.connectionCount}</span>
      </Link>
      <Link
        href="/feed/my-notifications"
        className="cursor-pointer text-sm font-semibold flex items-center px-4 gap-2"
      >
        <Bookmark size={16} className="font-semibold" />
        Notifications:
        <span className="text-[#9170FF]">{notification.notificationCount}</span>
      </Link>
    </div>
  );
};
