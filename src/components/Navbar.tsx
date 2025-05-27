"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth, UserButton } from "@clerk/nextjs";
import { NavbarSkeleton } from "./ui/skeletons/navbarSkeleton";

const Navbar = () => {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <nav className="w-full py-3 fixed top-0 left-0 z-[100] bg-white border-b">
      <div className="container flex justify-between items-center">
        <Link href="/">
          <h1 className="text-3xl font-medium">Sensa</h1>
        </Link>
        <div className="flex items-center gap-3 font-medium text-sm">
          {isLoaded ? (
            <>
              {!isSignedIn ? (
                <Link href="/auth/sign-in">
                  <Button variant="outline">Sign In</Button>
                </Link>
              ) : (
                <UserButton
                  userProfileUrl="/profile"
                  showName
                  appearance={{
                    elements: {
                      userButtonBox:
                        "shadow-xs border bg-background bg-input/30 border-input hover:bg-input/50 h-9 rounded-md gap-1.5 px-2.5",
                      avatarImage: "border-2 border-black rounded-full",
                    },
                  }}
                />
              )}
            </>
          ) : (
            <NavbarSkeleton />
          )}
          {pathname !== "/feed" && (
            <Link href="/feed">
              <Button type="button" variant="secondary" className="group">
                Explore Feed
                <ChevronRight className="transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
