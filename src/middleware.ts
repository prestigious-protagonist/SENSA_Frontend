import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/auth(.*)", "/feed(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const user = auth();
  const url = new URL(req.url);
  const userId = (await user).userId;

  if (
    userId &&
    (url.pathname.startsWith("/auth/sign-in") ||
      url.pathname.startsWith("/auth/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
