"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AuthorCardProps {
  className?: string;
  backgroundImage?: string;
  author: {
    name: string;
    avatar: string;
    readTime?: string;
  };
  content: {
    title: string;
    description: string;
  };
}

export const AuthorCard = ({
  className,
  backgroundImage,
  author,
  content,
}: AuthorCardProps) => {
  return (
    <div className="w-full">
      <div
        className={cn(
          "cursor-pointer relative overflow-hidden min-h-50 max-w-sm mx-auto flex flex-col gap-6 px-4 pt-4 bg-cover",
          className
        )}
      >
        <div
          className="absolute top-0 left-0 w-full h-16"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute top-0 left-0 w-full h-16 bg-black/10 z-10" />
        <div className="flex flex-row items-center space-x-4 z-10">
          <Image
            height={100}
            width={100}
            alt={`${author.name}'s avatar`}
            src={author.avatar}
            className="h-10 w-10 rounded-full border-2 object-cover"
          />
          <div className="flex flex-col">
            <p className="font-normal text-base text-gray-50 relative z-10">
              {author.name}
            </p>
            {author.readTime && (
              <p className="text-sm text-gray-200">{author.readTime}</p>
            )}
          </div>
        </div>
        <div className="text content">
          <h1 className="font-semibold text-xl md:text-2xl relative z-10">
            {content.title}
          </h1>
          <p className="font-normal text-sm relative z-10">
            {content.description}
          </p>
        </div>
      </div>
    </div>
  );
};
