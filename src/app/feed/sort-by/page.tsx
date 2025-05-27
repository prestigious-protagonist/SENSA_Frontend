"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

const page = () => {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const user = useSelector((state: any) => state.user);
  const users = useSelector((state: any) => state.users.users);
  console.log(user);

  if (!filter)
    return (
      <div className="w-full h-full flex flex-col space-y-6 justify-center items-center">
        <h1 className="text-4xl font-medium">Nothing to see here...</h1>
      </div>
    );

  const filteredUsers = users.filter((connection: any) => {
    if (filter === "Age") {
      return connection.age && connection.age > 0;
    } else if (filter === "Skills") {
      return connection.Skills && connection.Skills.length > 0;
    } else if (filter === "Gender") {
      return connection.gender && connection.gender !== "";
    } else if (filter === "Interests") {
      return connection.InterestedIns?.some((interest: any) =>
        user.interests.includes(interest.name)
      );
    }
    return true;
  });

  return (
    <div className="w-full h-full grid grid-cols-2 gap-10 relative">
      {users.length === 0 ? (
        <h4 className="text-center font-medium text-black text-xl absolute left-1/2 -translate-x-1/2 top-1/2">
          Nothing to see here
        </h4>
      ) : (
        filteredUsers.map((connection: any, index: number) => (
          <div
            key={index}
            className="bg-[#F4F2EE] relative overflow-hidden min-h-60 rounded-3xl w-full shadow-xl flex flex-col justify-between p-4 bg-cover"
          >
            <div
              className="absolute top-0 left-0 w-full h-20"
              style={{
                backgroundImage: `url(https://avatar.vercel.sh/${connection.fullname
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
                src={`${connection.profilePicture}`}
                className="h-10 w-10 rounded-full border-2 object-cover"
              />
              <div className="flex flex-col">
                <p className="font-normal text-base text-gray-50 relative">
                  {connection.fullname}
                </p>
                <p className="text-sm text-gray-100">{connection.email}</p>
              </div>
            </div>
            <div className="text content mt-8">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-lg md:text-xl relative">
                  {connection.username}
                </h1>
                <h3 className="text-sm">{connection.gender}</h3>
                <h3 className="text-sm -ml-1">{connection.age}</h3>
              </div>
              <p className="font-normal text-sm relative mt-1">
                {connection.bio}
              </p>
            </div>
            <div className="flex flex-col mt-4">
              <div>
                <p className="font-medium text-sm relative mb-0.5">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {connection.Skills.map((skill: any, index: number) => (
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
                    {connection.InterestedIns.map(
                      (interests: any, index: number) => (
                        <Badge key={index} className="text-sm">
                          {interests.name}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between mt-4 pb-2">
              <div className="flex flex-col gap-0.5">
                <p className="font-medium text-sm relative mb-0.5">Socials</p>
                <div className="flex items-center gap-3">
                  <Link href={`${connection.social.github}`} target="_blank">
                    <Image
                      src="https://img.clerk.com/static/github.svg?width=160"
                      alt="github"
                      width={27}
                      height={27}
                    />
                  </Link>
                  <Link href={`${connection.social.linkedIn}`} target="_blank">
                    <Image
                      src="https://img.clerk.com/static/linkedin.svg?width=160"
                      alt="github"
                      width={27}
                      height={27}
                    />
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/feed/my-chats?otherUserId=${connection.id}&otherUserAvatar=${connection.profilePicture}`}
                >
                  <Button variant="secondary" className="cursor-pointer group">
                    Chat
                    <MessageSquareText
                      size={16}
                      className="transition-transform group-hover:scale-[1.1]"
                    />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default page;
