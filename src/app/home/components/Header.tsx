"use client";
import Link from "next/link";
import localFont from "next/font/local";
import { useSession } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play } from "lucide-react";
import { FlipWords } from "@/components/ui/flip-words";
import { AuroraBackground } from "@/components/ui/aurora-background";

const dot = localFont({
  src: "../../../fonts/6796d350b8c706e4533e8007_OffBit-DotBold.ttf",
});

export const Header = () => {
  const { isSignedIn } = useSession();
  const words = ["create", "connect", "collaborate"];
  return (
    <AuroraBackground>
      <div className="container text-center z-10">
        <h1 className="text-7xl font-semibold">Ideas take flight here</h1>
        <div className="text-3xl mt-6 font-medium text-gray-700">
          <FlipWords words={words} className={`${dot.className}`} />
          with Skill Exchange Network with Smart AI
        </div>
        <div className="flex items-center gap-3 justify-center mt-10">
          <Link href={` ${isSignedIn ? "/feed" : "/auth/sign-in"}`}>
            <Button
              type="button"
              variant="secondary"
              className="group text-base font-medium"
            >
              Get Started{" "}
              <ChevronRight className="transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link href="/">
            <Button
              type="button"
              variant="outline"
              className="group text-base font-medium"
            >
              View Demo{" "}
              <Play className="transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </div>
    </AuroraBackground>
  );
};