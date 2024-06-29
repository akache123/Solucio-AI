import { clerkMiddleware } from "@clerk/nextjs/server";

const customClerkMiddleware = clerkMiddleware({
  publishableKey: process.env.CLERK_AUTH_KEY,
});

export default customClerkMiddleware;

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
